import { useEffect, useRef, useState } from "react";

import { EDITOR_SECTIONS } from "@/features/character/constants/chibiPalette";

import type { EditorSectionId } from "@/features/character/constants/chibiPalette";

/** 꾸미기 목록 — 스크롤 위치에 맞춰 지금 부위 표시, 메뉴 누르면 그 부위로 이동 */
export function useEditorSections() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef(new Map<EditorSectionId, HTMLElement>());
  const [activeId, setActiveId] = useState<EditorSectionId>(EDITOR_SECTIONS[0].id);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    // 목록 윗부분 띠에 걸친 부위를 지금 부위로
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveId(hit.target.getAttribute("data-section") as EditorSectionId);
      },
      { root, rootMargin: "0px 0px -70% 0px" },
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const register = (id: EditorSectionId) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  const scrollTo = (id: EditorSectionId) => {
    setActiveId(id);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sectionRefs.current
      .get(id)
      ?.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "start" });
  };

  return { scrollRef, register, activeId, scrollTo };
}
