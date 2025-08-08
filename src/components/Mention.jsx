import { getReadableTextColor } from '../utils/getReadableTextColor';

export function Mention({ node }) {
  const backgroundColor = node.color || '#e5e7eb';
  const textColor = getReadableTextColor(backgroundColor);
  
  // Extract text from children array or fallback to direct properties
  const displayText = node.children?.[0]?.text || node.text || node.value || node.content || '';
  
  return (
    <span
      className="rounded-md px-2 py-[2px] text-sm font-medium inline-block"
      style={{
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      {displayText}
    </span>
  );
}