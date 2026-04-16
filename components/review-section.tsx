"use client";

import { useMemo, useState } from "react";
import { Review } from "@/lib/types";
import { useApp } from "@/providers/app-provider";

export function ReviewSection({ parkingId, reviews }: { parkingId: string; reviews: Review[] }) {
  const { currentUser, addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const parkingReviews = useMemo(
    () => reviews.filter((review) => review.parkingId === parkingId),
    [parkingId, reviews]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await addReview({ parkingId, rating, comment });
    setMessage(result.message);
    if (result.ok) {
      setComment("");
      setRating(5);
    }
  }

  return (
    <section className="card stack">
      <div className="section-heading">
        <div>
          <h3>Ratings & reviews</h3>
          <p>Driver feedback builds trust and helps future guests book quickly.</p>
        </div>
      </div>

      <div className="review-list">
        {parkingReviews.length ? (
          parkingReviews.map((review) => (
            <article key={review.id} className="review-item">
              <div className="review-header">
                <strong>{review.userName}</strong>
                <span>{"?".repeat(review.rating)}</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))
        ) : (
          <p className="muted">No reviews yet. Be the first to share how the parking experience went.</p>
        )}
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Rating
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            Review
            <textarea
              placeholder={currentUser ? "Was it easy to enter, safe, and accurate?" : "Sign in to leave feedback"}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
            />
          </label>
        </div>
        <div className="inline-row">
          <button className="primary-button" disabled={!currentUser || !comment.trim()} type="submit">
            Submit review
          </button>
          {message ? <span className="muted">{message}</span> : null}
        </div>
      </form>
    </section>
  );
}
