import React from "react";
import { TagGroup, Tag } from "@fluentui/react-components";

const TagGroupFixed = ({ label, items, onRemove }) => {
  if (!items?.length) return null;
  return (
    <TagGroup aria-label={`${label} list`}>
      {items.map((item, idx) => (
        <Tag
          key={`${item}-${idx}`}
          shape="rounded"
          appearance="brand"
          dismissible
          onDismiss={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(idx);
          }}
        >
          {item}
        </Tag>
      ))}
    </TagGroup>
  );
};

export default TagGroupFixed;
