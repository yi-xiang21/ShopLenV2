import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { ActiveMenuKey, HeaderMenuItemData } from "./Header";

type MenuMultiProps = {
  data: HeaderMenuItemData[];
  label: string;
  isActive?: boolean;
  setActiveMenu?: (key: ActiveMenuKey) => void;
  variant?: "desktop" | "mobile";
};

const MenuMulti: React.FC<MenuMultiProps> = ({
  data,
  label,
  isActive = false,
  setActiveMenu,
  variant = "desktop",
}) => {
  const [expandedBranch, setExpandedBranch] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSubMenu = (itemPath: string, parentBranch: string[]) => {
    setExpandedBranch((prev) => {
      if (prev.includes(itemPath)) {
        return parentBranch;
      }

      return [...parentBranch, itemPath];
    });
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && setActiveMenu) {
      setActiveMenu("categories");
    }
  };

  const showDropdown = variant === "mobile" ? isOpen : isOpen || isHovered;

  const renderMenuItems = (
    items: HeaderMenuItemData[],
    level = 0,
    parentPath = "",
    parentBranch: string[] = [],
  ): React.ReactElement => {
    return (
      <ul
        className={
          level === 0
            ? "space-y-1"
            : variant === "mobile"
              ? "mt-1 space-y-1 border-l border-orange-200 pl-3"
              : "mt-1 space-y-1 border-l-2 border-amber-200"
        }
      >
        {items.map((menuItem) => {
          const itemPath = parentPath
            ? `${parentPath}-${menuItem.id}`
            : `${menuItem.id}`;
          const hasChildren = Boolean(
            menuItem.children && menuItem.children.length > 0,
          );
          const isExpanded = expandedBranch.includes(itemPath);

          return (
            <li key={itemPath}>
              {hasChildren ? (
                <button
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
                    variant === "mobile"
                      ? isExpanded
                        ? "border-l-2 border-[#ee4d2d] bg-[#fff1ee] text-[#ee4d2d]"
                        : "text-gray-700 hover:bg-orange-50"
                      : isExpanded
                        ? "bg-amber-50 text-amber-800"
                        : "text-gray-700 hover:bg-gray-50 hover:text-amber-800"
                  }`}
                  onClick={() => toggleSubMenu(itemPath, parentBranch)}
                  style={{
                    paddingLeft:
                      variant === "mobile"
                        ? `${0.5 + level * 0.4}rem`
                        : `${0.75 + level * 0.6}rem`,
                  }}
                  type="button"
                >
                  <span>{menuItem.name}</span>
                  <FiChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <a
                  className={`block rounded px-3 py-2.5 text-left text-sm text-gray-600 transition-colors duration-150 ${
                    variant === "mobile"
                      ? "hover:bg-orange-50 hover:text-[#ee4d2d]"
                      : "hover:bg-amber-100 hover:text-amber-800"
                  }`}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    paddingLeft:
                      variant === "mobile"
                        ? `${0.5 + level * 0.4}rem`
                        : `${0.75 + level * 0.6}rem`,
                  }}
                >
                  {menuItem.name}
                </a>
              )}

              {hasChildren && isExpanded && menuItem.children
                ? renderMenuItems(menuItem.children, level + 1, itemPath, [
                    ...parentBranch,
                    itemPath,
                  ])
                : null}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <li
      className={variant === "mobile" ? "relative" : "relative px-7 py-3"}
      onMouseEnter={variant === "desktop" ? () => setIsHovered(true) : undefined}
      onMouseLeave={variant === "desktop" ? () => setIsHovered(false) : undefined}
    >
      <button
        aria-expanded={showDropdown}
        aria-haspopup="menu"
        className={
          variant === "mobile"
            ? `flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
              isActive
                ? "border-l-2 border-[#ee4d2d] bg-[#fff1ee] text-[#ee4d2d]"
                : "text-gray-700 hover:bg-orange-50"
              }`
            : `inline-flex items-center gap-1 transition-all duration-200 ${
                isActive
                  ? "-translate-y-0.5 text-amber-800 italic"
                  : "hover:-translate-y-0.5 hover:text-amber-800 hover:italic"
              }`
        }
        onClick={handleToggle}
        type="button"
      >
        <span>{label}</span>
        <FiChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
        />
      </button>
      {isActive && variant === "desktop" && (
        <span className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-black" />
      )}

      {showDropdown && (
        <div
          className={
            variant === "mobile"
              ? "mt-1 rounded-md border border-orange-200 bg-white p-2"
              : "absolute left-0 top-full z-50 mt-0 w-96 rounded-xl border border-amber-100 bg-white p-2 shadow-lg md:left-auto md:right-0"
          }
        >
          {renderMenuItems(data)}
        </div>
      )}
    </li>
  );
};

export default MenuMulti;
