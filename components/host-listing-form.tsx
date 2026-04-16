"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadParkingImages } from "@/lib/storage";
import { ParkingType } from "@/lib/types";
import { useApp } from "@/providers/app-provider";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    <section className="card stack">
      <div className="section-heading">
        <div>
          <h3>List your parking space</h3>
          <p>Hosts can publish a new parking asset in one form and start receiving bookings.</p>
        </div>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Listing title
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Covered slot beside metro station"
            />
          </label>
          <label>
            Address
            <input
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="House no, street, locality"
            />
          </label>
          <label>
            City
            <input value={form.city} onChange={(event) => updateField("city", event.target.value)} />
          </label>
          <label>
            Parking type
            <select value={form.type} onChange={(event) => updateField("type", event.target.value as ParkingType)}>
              <option value="Garage">Garage</option>
              <option value="Open">Open</option>
              <option value="Covered">Covered</option>
            </select>
          </label>
          <label>
            Latitude
            <input value={form.latitude} onChange={(event) => updateField("latitude", event.target.value)} />
          </label>
          <label>
            Longitude
            <input value={form.longitude} onChange={(event) => updateField("longitude", event.target.value)} />
          </label>
          <label>
            Price / hour
            <input value={form.priceHour} onChange={(event) => updateField("priceHour", event.target.value)} />
          </label>
          <label>
            Price / day
            <input value={form.priceDay} onChange={(event) => updateField("priceDay", event.target.value)} />
          </label>
          <label>
            Price / month
            <input value={form.priceMonth} onChange={(event) => updateField("priceMonth", event.target.value)} />
          </label>
          <label>
            Start time
            <input
              type="time"
              value={form.availabilityStart}
              onChange={(event) => updateField("availabilityStart", event.target.value)}
            />
          </label>
          <label>
            End time
            <input
              type="time"
              value={form.availabilityEnd}
              onChange={(event) => updateField("availabilityEnd", event.target.value)}
            />
          </label>
          <label className="wide">
            Amenities
            <input
              value={form.amenities}
              onChange={(event) => updateField("amenities", event.target.value)}
              placeholder="CCTV, shaded, gated access"
            />
          </label>
          <label className="wide">
            Parking images
            <input accept="image/*" multiple onChange={handleImageSelection} type="file" />
            <span className="muted">
              Upload driveway, garage, or entry photos. In demo mode, images stay local in your browser.
            </span>
          </label>
          <label className="wide">
            Description
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              placeholder="What makes this parking space convenient and safe?"
            />
          </label>
        </div>

        {uploadedImages.length ? (
          <div className="stack compact">
            <span className="label">Uploaded previews</span>
            <div className="upload-preview-grid">
              {uploadedImages.map((image, index) => (
                <div className="upload-preview" key={`${image}-${index}`}>
                  <Image
                    alt={`Parking preview ${index + 1}`}
                    className="listing-image"
                    fill
                    src={image}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="stack compact">
          <span className="label">Available days</span>
          <div className="tag-list">
            {dayOptions.map((day) => {
              const active = form.availabilityDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`filter-chip ${active ? "active" : ""}`}
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

        <label className="checkbox-row">
          <input
            checked={form.instantBook}
            onChange={(event) => updateField("instantBook", event.target.checked)}
            type="checkbox"
          />
          Allow instant booking
        </label>

        <div className="inline-row">
          <button
            className="primary-button"
            disabled={!currentUser || currentUser.role !== "host" || uploading}
            type="submit"
          >
            Publish listing
          </button>
          {uploading ? <span className="muted">Uploading images...</span> : null}
          {message ? <span className="muted">{message}</span> : null}
        </div>
      </form>
    </section>
  );
}
