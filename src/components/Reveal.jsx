import { useInView } from '../lib/hooks';

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`rv ${inView ? 'in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({ index, kicker, title, accent, text }) {
  return (
    <Reveal className="head">
      <div>
        <div className="kicker mono"><span>{index}</span>{kicker}</div>
        <h2>{title} <em>{accent}</em></h2>
      </div>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
