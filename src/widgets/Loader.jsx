import css from './css/Loader.module.scss'
export default function Loader() {
  return (
    <div className={css.loader_view}>
      <span className={css.loader}></span>
    </div>
  )
}
