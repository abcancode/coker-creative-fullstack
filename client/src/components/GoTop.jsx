import { useEffect } from "react";

const GoTop = () => {
  useEffect(() => {
    const btn = document.getElementById("goTop");

    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle("show", window.scrollY > 400);
    };

    const onClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", onScroll);
    btn.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      btn.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <button className="go-top" id="goTop" aria-label="Go to top">
      <span className="go-top-arrow">↑</span>
    </button>
  );
};

export default GoTop;
