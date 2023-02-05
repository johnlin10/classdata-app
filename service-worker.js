// 檢查餅刪除舊快取
const deleteCache = async (key) => {
  await caches.delete(key)
}
const deleteOldCaches = async () => {
  const cacheKeepList = ["v5.0.0.3"]
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}
// 通過版本控制更新
const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v5.0.0.3")
  await cache.addAll(resources)
}
const putInCache = async (request, response) => {
  const cache = await caches.open("v5.0.0.3")
  await cache.put(request, response)
}
// 啟動 Service Worker
const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }
  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    console.info("使用預載響應", preloadResponse)
    putInCache(request, preloadResponse.clone())
    return preloadResponse
  }
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request)
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone())
    return responseFromNetwork
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl)
    if (fallbackResponse) {
      return fallbackResponse
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("發生網絡錯誤", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
// 預載
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable()
  }
}
self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload())
})
// 刪除舊快取
self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches())
})
// 安裝資源
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    addResourcesToCache([
      "/classdata/classdata.html",
      "/classdata/manifest.json",
      "/classdata/js/scripts.js",
      "/classdata/js/change-page.js",
      "/classdata/css/home-style.css",
      "/classdata/css/post-style.css",
      "/classdata/css/folder-style.css",
      "/classdata/css/development-style.css",
      "/classdata/css/CourseSchedule-style.css",
    ])
  )
})
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "/classdata/school.png",
    }).then((response) => {
      return response
    })
  )
})

// 定時檢查更新
setInterval(() => {
  deleteOldCaches()
  fetch('/cache.json')
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .then(json => {
      addResourcesToCache(json.resources)
    })
  self.skipWaiting()
}, 30000) 