"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadParkingImages } from "@/lib/storage";
import { ParkingType } from "@/lib/types";
import { useApp } from "@/providers/app-provider";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fieldClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white";
const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";

export function HostListingForm() {
  const { addParkingSpace, currentUser } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "Bengaluru",
    latitude: "12.9716",
    longitude: "77.5946",
    description: "",
    type: "Covered" as ParkingType,
    amenities: "CCTV, gated access",
    priceHour: "75",
    priceDay: "450",
    priceMonth: "6000",
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availabilityStart: "08:00",
    availabilityEnd: "20:00",
    instantBook: true
  });

  function updateField(field: string, value: string | boolean | string[]) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
    setMessage(null);

    if (!files.length || !currentUser) {
      setUploadedImages([]);
      return;
    }

    try {
      setUploading(true);
      const imageUrls = await uploadParkingImages(files, currentUser.id);
      setUploadedImages(imageUrls);
      setMessage(
        imageUrls.length
          ? "Images uploaded successfully."
          : "No images were uploaded."
      );
    } catch (error) {
      setUploadedImages([]);
      setMessage(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedFiles.length && !uploadedImages.length) {
      setMessage("Please wait for image upload to finish before publishing.");
      return;
    }

    const result = await addParkingSpace({
      title: form.title,
      address: form.address,
      city: form.city,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      description: form.description,
      type: form.type,
      images: uploadedImages,
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      priceHour: Number(form.priceHour),
      priceDay: Number(form.priceDay),
      priceMonth: Number(form.priceMonth),
      availabilityDays: form.availabilityDays,
      availabilityStart: form.availabilityStart,
      availabilityEnd: form.availabilityEnd,
      instantBook: form.instantBook
    });
    setMessage(result.message);

    if (result.ok) {
      setForm((prev) => ({
        ...prev,
        title: "",
        address: "",
        description: ""
      }));
      setSelectedFiles([]);
      setUploadedImages([]);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
      <div className="space-y-2">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            New listing
          </span>
        </div>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">List your parking space</h3>
        <p className="max-w-3xl text-base leading-7 text-slate-500">
          Hosts can publish a new parking asset in one clean form and start receiving bookings.
        </p>
      </div>

      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-2">
            <span>Listing title</span>
            <input
              className={fieldClass}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Covered slot beside metro station"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>City</span>
            <input className={fieldClass} value={form.city} onChange={(event) => updateField("city", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-2">
            <span>Address</span>
            <input
              className={fieldClass}
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="House no, street, locality"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Parking type</span>
            <select
              className={fieldClass}
              value={form.type}
              onChange={(event) => updateField("type", event.target.value as ParkingType)}
            >
              <option value="Garage">Garage</option>
              <option value="Open">Open</option>
              <option value="Covered">Covered</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Latitude</span>
            <input className={fieldClass} value={form.latitude} onChange={(event) => updateField("latitude", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Longitude</span>
            <input className={fieldClass} value={form.longitude} onChange={(event) => updateField("longitude", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Price / hour</span>
            <input className={fieldClass} value={form.priceHour} onChange={(event) => updateField("priceHour", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Price / day</span>
            <input className={fieldClass} value={form.priceDay} onChange={(event) => updateField("priceDay", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Price / month</span>
            <input className={fieldClass} value={form.priceMonth} onChange={(event) => updateField("priceMonth", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Start time</span>
            <input
              className={fieldClass}
              type="time"
              value={form.availabilityStart}
              onChange={(event) => updateField("availabilityStart", event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>End time</span>
            <input
              className={fieldClass}
              type="time"
              value={form.availabilityEnd}
              onChange={(event) => updateField("availabilityEnd", event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-2">
            <span>Amenities</span>
            <input
              className={fieldClass}
              value={form.amenities}
              onChange={(event) => updateField("amenities", event.target.value)}
              placeholder="CCTV, shaded, gated access"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-3">
            <span>Parking images</span>
            <input
              className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500"
              accept="image/*"
              multiple
              onChange={handleImageSelection}
              type="file"
            />
            <span className="text-sm text-slate-500">
              Upload driveway, garage, or entry photos. In demo mode, images stay local in your browser.
            </span>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-3">
            <span>Description</span>
            <textarea
              className="min-h-[160px] w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              placeholder="What makes this parking space convenient and safe?"
            />
          </label>
        </div>

        {uploadedImages.length ? (
          <div className="space-y-3">
            <span className="block text-sm font-medium text-slate-700">Uploaded previews</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {uploadedImages.map((image, index) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" key={`${image}-${index}`}>
                  <Image
                    alt={`Parking preview ${index + 1}`}
                    className="object-cover"
                    fill
                    src={image}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <span className="block text-sm font-medium text-slate-700">Available days</span>
          <div className="flex flex-wrap gap-3">
            {dayOptions.map((day) => {
              const active = form.availabilityDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() =>
                    updateField(
                      "availabilityDays",
                      active
                        ? form.availabilityDays.filter((item) => item !== day)
                        : [...form.availabilityDays, day]
                    )
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
            checked={form.instantBook}
            onChange={(event) => updateField("instantBook", event.target.checked)}
            type="checkbox"
          />
          Allow instant booking
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className={primaryButtonClass}
            disabled={!currentUser || currentUser.role !== "host" || uploading}
            type="submit"
          >
            Publish listing
          </button>
          {uploading ? <span className="text-sm text-slate-500">Uploading images...</span> : null}
          {message ? <span className="text-sm font-medium text-indigo-600">{message}</span> : null}
        </div>
      </form>
    </section>
  );
}
