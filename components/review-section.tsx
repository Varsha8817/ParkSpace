"use client";

import { useMemo, useState } from "react";
import { Review } from "@/lib/types";
import { useApp } from "@/providers/app-provider";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";

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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Ratings and reviews</h3>
        <p className="text-base leading-7 text-slate-500">
          Driver feedback builds trust and helps future guests book quickly.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {parkingReviews.length ? (
          parkingReviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm font-semibold text-slate-900">{review.userName}</strong>
                <span className="text-sm font-medium text-indigo-600">{review.rating}/5</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-500">{review.comment}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">No reviews yet. Be the first to share how the parking experience went.</p>
        )}
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Rating</span>
            <select
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Review</span>
            <textarea
              className="min-h-[140px] w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder={currentUser ? "Was it easy to enter, safe, and accurate?" : "Sign in to leave feedback"}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
            />
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className={primaryButtonClass} disabled={!currentUser || !comment.trim()} type="submit">
            Submit review
          </button>
          {message ? <span className="text-sm font-medium text-indigo-600">{message}</span> : null}
        </div>
      </form>
    </section>
  );
}

