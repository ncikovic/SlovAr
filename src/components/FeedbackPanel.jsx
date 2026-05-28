import React from "react";

export default function FeedbackPanel({ feedback, onNext, t }) {
  if (!feedback) return null;

  return (
    <div className="feedbackLayer" role="status" aria-live="polite">
      <section className={`feedbackPanel ${feedback.kind}`}>
        <div className="feedbackIcon" aria-hidden="true" />
        <p>{feedback.message}</p>
        <button type="button" onClick={onNext}>
          {feedback.nextLabel ?? t.next}
        </button>
      </section>
    </div>
  );
}
