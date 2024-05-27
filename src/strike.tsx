export default function Strike({
  pattern = [],
  i,
}: {
  pattern: number[];
  i: number;
}) {
  if (!pattern.includes(i)) return;

  let style = { transform: "" };
  if (pattern.every((n, i) => n === pattern[0] + i) || pattern.length < 3) {
    style = { transform: "" };
  } else if (pattern.every((n, i) => n === pattern[0] + i * 3)) {
    style = { transform: "rotate(90deg)" };
  } else {
    if (pattern[0] === 0) style = { transform: "rotate(42deg) scaleX(1.45)" };
    if (pattern[0] === 2) style = { transform: "rotate(-42deg) scaleX(1.45)" };
  }
  
  return (
    <span
      className={`top-50% absolute left-0 right-0 z-0 scale-x-150 border-2`}
      style={style}
    ></span>
  );
}
