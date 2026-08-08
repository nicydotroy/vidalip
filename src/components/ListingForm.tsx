"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveListingAction, type ListingFormState } from "@/app/dashboard/actions";
import { CATEGORIES, CURRENCIES, RATE_UNIT_LABEL, RATE_UNITS } from "@/lib/constants";
import { GalleryField, SingleImageField } from "./ImageField";
import { AvailabilityField, type Slot } from "./AvailabilityField";

export type ListingFormValues = {
  id?: string;
  title: string;
  category: string;
  location: string;
  description: string;
  rateAmount: string;
  rateCurrency: string;
  rateUnit: string;
  contactEmail: string;
  phone: string;
  website: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
  coverImage: string;
  galleryImages: string[];
  availability: Slot[];
};

export const emptyListing: ListingFormValues = {
  title: "",
  category: "",
  location: "",
  description: "",
  rateAmount: "",
  rateCurrency: "USD",
  rateUnit: "HOUR",
  contactEmail: "",
  phone: "",
  website: "",
  metaTitle: "",
  metaDescription: "",
  metaImage: "",
  coverImage: "",
  galleryImages: [],
  availability: [],
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-ink-400">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending
        ? "Saving…"
        : isEdit
          ? "Save and resubmit for review"
          : "Submit for review"}
    </button>
  );
}

export default function ListingForm({
  initial,
  isEdit = false,
}: {
  initial: ListingFormValues;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState<ListingFormState, FormData>(
    saveListingAction,
    {},
  );
  const errors = state.fieldErrors ?? {};

  // Controlled only where the value is not a plain input: images and slots are
  // serialised into hidden fields on submit.
  const [coverImage, setCoverImage] = useState(initial.coverImage);
  const [metaImage, setMetaImage] = useState(initial.metaImage);
  const [gallery, setGallery] = useState<string[]>(initial.galleryImages);
  const [slots, setSlots] = useState<Slot[]>(initial.availability);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);

  const err = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-400">{errors[name]}</p>
    ) : null;

  return (
    <form action={formAction} className="space-y-6">
      {initial.id && <input type="hidden" name="listingId" value={initial.id} />}
      <input type="hidden" name="coverImage" value={coverImage} />
      <input type="hidden" name="metaImage" value={metaImage} />
      <input type="hidden" name="galleryImages" value={JSON.stringify(gallery)} />
      <input type="hidden" name="availability" value={JSON.stringify(slots)} />

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <Section
        title="The basics"
        description="This is what people see first in search results."
      >
        <div>
          <label className="label" htmlFor="title">
            Listing title
          </label>
          <input
            id="title"
            name="title"
            className="input"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Call Girls in Bangalore"
          />
          {err("title")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="input"
              required
              defaultValue={initial.category}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {err("category")}
          </div>

          <div>
            <label className="label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              className="input"
              required
              defaultValue={initial.location}
              placeholder="Bangalore, Hyderabad, Mumbai, Delhi, Pune or All cities"
            />
            {err("location")}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={7}
            className="input resize-y"
            required
            minLength={30}
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Experience, the kind of work you take on, what a booking includes…"
          />
          <p className="hint">{description.length}/5000 · minimum 30 characters</p>
          {err("description")}
        </div>
      </Section>

      <Section
        title="Photos"
        description="The cover photo headlines your listing; the gallery shows your range."
      >
        <SingleImageField
          label="Cover photo"
          value={coverImage}
          onChange={setCoverImage}
        />
        <GalleryField value={gallery} onChange={setGallery} />
        {err("coverImage")}
        {err("galleryImages")}
      </Section>

      <Section title="Rate" description="What you charge, and per what.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="rateAmount">
              Amount
            </label>
            <input
              id="rateAmount"
              name="rateAmount"
              type="number"
              min="1"
              step="0.01"
              className="input"
              required
              defaultValue={initial.rateAmount}
              placeholder="250"
            />
            {err("rateAmount")}
          </div>

          <div>
            <label className="label" htmlFor="rateCurrency">
              Currency
            </label>
            <select
              id="rateCurrency"
              name="rateCurrency"
              className="input"
              defaultValue={initial.rateCurrency}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {err("rateCurrency")}
          </div>

          <div>
            <label className="label" htmlFor="rateUnit">
              Billed
            </label>
            <select
              id="rateUnit"
              name="rateUnit"
              className="input"
              defaultValue={initial.rateUnit}
            >
              {RATE_UNITS.map((u) => (
                <option key={u} value={u}>
                  {RATE_UNIT_LABEL[u]}
                </option>
              ))}
            </select>
            {err("rateUnit")}
          </div>
        </div>
      </Section>

      <Section
        title="Availability"
        description="Your usual working hours, by day of the week."
      >
        <AvailabilityField value={slots} onChange={setSlots} />
        {err("availability")}
      </Section>

      <Section
        title="Contact"
        description="How interested clients reach you. All optional."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="contactEmail">
              Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              className="input"
              defaultValue={initial.contactEmail}
            />
            {err("contactEmail")}
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              className="input"
              defaultValue={initial.phone}
            />
            {err("phone")}
          </div>
          <div>
            <label className="label" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              className="input"
              defaultValue={initial.website}
              placeholder="https://…"
            />
            {err("website")}
          </div>
        </div>
      </Section>

      <Section
        title="Search engine preview"
        description="Optional. Leave blank and we use your title and description."
      >
        <div>
          <label className="label" htmlFor="metaTitle">
            Meta title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            className="input"
            maxLength={70}
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || "Defaults to your listing title"}
          />
          <p className="hint">{metaTitle.length}/70 · around 60 reads best</p>
          {err("metaTitle")}
        </div>

        <div>
          <label className="label" htmlFor="metaDescription">
            Meta description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows={3}
            className="input resize-y"
            maxLength={200}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Defaults to the first part of your description"
          />
          <p className="hint">{metaDescription.length}/200 · around 155 reads best</p>
          {err("metaDescription")}
        </div>

        <SingleImageField
          label="Social share image"
          hint="Shown when your listing is shared on social media. Defaults to your cover photo."
          value={metaImage}
          onChange={setMetaImage}
        />
        {err("metaImage")}

        <div className="rounded-lg border border-ink-700 bg-ink-850 p-4">
          <p className="text-xs uppercase tracking-wide text-ink-400">
            Google preview
          </p>
          <p className="mt-2 truncate text-base text-brand-400">
            {metaTitle || title || "Your listing title"}
          </p>
          <p className="text-xs text-emerald-400">vidalip.com › listing</p>
          <p className="mt-1 line-clamp-2 text-sm text-ink-300">
            {metaDescription ||
              description.slice(0, 155) ||
              "Your description will appear here."}
          </p>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Link href="/dashboard" className="btn-ghost">
          Cancel
        </Link>
        <p className="text-sm text-ink-400">
          {isEdit
            ? "Edits go back to the moderation queue before they are published."
            : "An admin reviews your listing before it appears publicly."}
        </p>
      </div>
    </form>
  );
}
