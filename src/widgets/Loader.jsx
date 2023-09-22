import css from './css/Loader.module.css'
export default function Loader() {
  return (
    <div className={css.loader_view}>
      <span className={css.loader}></span>
    </div>
  )
}
