"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  removeStoreLogo,
  updateAnnouncementSettings,
  updateFooterSettings,
  updateLogoSettings,
} from "@/actions/admin-store-settings";
import { StoreImage } from "@/components/store/store-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FIXED_FOOTER_LINKS, FIXED_SOCIAL_PLATFORMS } from "@/lib/store-branding-constants";
import type { StoreBranding } from "@/types/store-settings";

type StoreSettingsEditorProps = {
  settings: StoreBranding;
};

export function StoreSettingsEditor({ settings }: StoreSettingsEditorProps) {
  const [logoType, setLogoType] = useState(settings.logoType);
  const [logoPreview, setLogoPreview] = useState(settings.logoImageUrl);

  return (
    <div className="grid gap-8">
      <LogoSettingsForm
        settings={settings}
        logoType={logoType}
        logoPreview={logoPreview}
        onLogoTypeChange={setLogoType}
        onLogoPreviewChange={setLogoPreview}
      />
      <FooterSettingsForm settings={settings} />
      <AnnouncementSettingsForm settings={settings} />
    </div>
  );
}

function LogoSettingsForm({
  settings,
  logoType,
  logoPreview,
  onLogoTypeChange,
  onLogoPreviewChange,
}: {
  settings: StoreBranding;
  logoType: StoreBranding["logoType"];
  logoPreview: string | null;
  onLogoTypeChange: (value: StoreBranding["logoType"]) => void;
  onLogoPreviewChange: (value: string | null) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemoveLogo() {
    startRemoveTransition(async () => {
      const result = await removeStoreLogo();
      if (result.success) {
        onLogoPreviewChange(null);
        onLogoTypeChange("TEXT");
        toast.success("Logo image supprime.");
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await updateLogoSettings(formData);
              if (result.success) {
                const file = formData.get("logoFile");
                if (file instanceof File && file.size > 0) {
                  onLogoPreviewChange(URL.createObjectURL(file));
                  onLogoTypeChange("IMAGE");
                }
                toast.success("Logo mis a jour.");
                return;
              }
              toast.error(result.error);
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label>Type de logo</Label>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="logoType"
                  value="TEXT"
                  checked={logoType === "TEXT"}
                  onChange={() => onLogoTypeChange("TEXT")}
                  disabled={isPending}
                />
                Texte
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="logoType"
                  value="IMAGE"
                  checked={logoType === "IMAGE"}
                  onChange={() => onLogoTypeChange("IMAGE")}
                  disabled={isPending}
                />
                Image
              </label>
            </div>
          </div>

          {logoType === "TEXT" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="logoText">Texte du logo</Label>
                <Textarea
                  id="logoText"
                  name="logoText"
                  defaultValue={settings.logoText}
                  rows={2}
                  placeholder={"Marwa\nCrystal"}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="logoColor">Couleur du texte</Label>
                  <Input
                    id="logoColor"
                    name="logoColor"
                    type="color"
                    defaultValue={settings.logoColor}
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logoSize">Taille</Label>
                  <select
                    id="logoSize"
                    name="logoSize"
                    defaultValue={settings.logoSize}
                    disabled={isPending}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    <option value="sm">Petit</option>
                    <option value="base">Normal</option>
                    <option value="lg">Large</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                    <option value="3xl">3XL</option>
                    <option value="4xl">4XL</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logoFontWeight">Epaisseur</Label>
                  <select
                    id="logoFontWeight"
                    name="logoFontWeight"
                    defaultValue={settings.logoFontWeight}
                    disabled={isPending}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="grid gap-4">
              {logoPreview ? (
                <div className="relative h-20 w-48 overflow-hidden rounded-xl border border-border bg-muted">
                  <StoreImage
                    src={logoPreview}
                    alt="Logo actuel"
                    fill
                    className="object-contain p-2"
                    sizes="192px"
                  />
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="logoFile">Uploader un logo depuis l&apos;ordinateur</Label>
                <Input
                  id="logoFile"
                  name="logoFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP ou SVG — max 2 Mo. Le nouveau fichier remplace l&apos;existant.
                </p>
              </div>
              {logoPreview ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || isRemoving}
                  onClick={handleRemoveLogo}
                >
                  {isRemoving ? "Suppression..." : "Supprimer le logo image"}
                </Button>
              ) : null}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="logoWidth">Largeur header (px)</Label>
              <Input
                id="logoWidth"
                name="logoWidth"
                type="number"
                min={40}
                max={600}
                defaultValue={settings.logoWidth}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logoHeight">Hauteur header (px)</Label>
              <Input
                id="logoHeight"
                name="logoHeight"
                type="number"
                min={20}
                max={300}
                defaultValue={settings.logoHeight}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="footerLogoWidth">Largeur footer (px)</Label>
              <Input
                id="footerLogoWidth"
                name="footerLogoWidth"
                type="number"
                min={40}
                max={600}
                defaultValue={settings.footerLogoWidth}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="footerLogoHeight">Hauteur footer (px)</Label>
              <Input
                id="footerLogoHeight"
                name="footerLogoHeight"
                type="number"
                min={20}
                max={300}
                defaultValue={settings.footerLogoHeight}
                disabled={isPending}
              />
            </div>
          </div>

          {logoType === "IMAGE" ? (
            <>
              <input type="hidden" name="logoText" value={settings.logoText} />
              <input type="hidden" name="logoColor" value={settings.logoColor} />
              <input type="hidden" name="logoSize" value={settings.logoSize} />
              <input type="hidden" name="logoFontWeight" value={settings.logoFontWeight} />
            </>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer le logo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FooterSettingsForm({ settings }: { settings: StoreBranding }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await updateFooterSettings(formData);
              if (result.success) {
                toast.success("Footer mis a jour.");
                return;
              }
              toast.error(result.error);
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label>Liens de navigation (fixes)</Label>
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              {FIXED_FOOTER_LINKS.map((link) => (
                <p key={link.href}>
                  {link.label} — {link.href}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footerDescription">Description</Label>
            <Textarea
              id="footerDescription"
              name="footerDescription"
              defaultValue={settings.footerDescription}
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {FIXED_SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform.key} className="grid gap-2">
                <Label htmlFor={`${platform.key}Url`}>{platform.label}</Label>
                <Input
                  id={`${platform.key}Url`}
                  name={`${platform.key}Url`}
                  defaultValue={settings.socialUrls[platform.key]}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Les icones Facebook, Instagram, TikTok et WhatsApp restent fixes. Seules les URLs
            sont modifiables.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Telephone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                defaultValue={settings.contactInfo.phone}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                defaultValue={settings.contactInfo.email ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="contactAddress">Adresse</Label>
              <Input
                id="contactAddress"
                name="contactAddress"
                defaultValue={settings.contactInfo.address}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="contactHours">Horaires</Label>
              <Input
                id="contactHours"
                name="contactHours"
                defaultValue={settings.contactInfo.hours}
                disabled={isPending}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="copyrightText">Copyright</Label>
            <Input
              id="copyrightText"
              name="copyrightText"
              defaultValue={settings.copyrightText}
              disabled={isPending}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer le footer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AnnouncementSettingsForm({ settings }: { settings: StoreBranding }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banniere annonce</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await updateAnnouncementSettings(formData);
              if (result.success) {
                toast.success("Banniere mise a jour.");
                return;
              }
              toast.error(result.error);
            });
          }}
          className="grid gap-4"
        >
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              name="announcementEnabled"
              type="checkbox"
              value="true"
              defaultChecked={settings.announcementEnabled}
              disabled={isPending}
            />
            Afficher la banniere en haut du site
          </label>
          <div className="grid gap-2">
            <Label htmlFor="announcementText">Texte de la banniere</Label>
            <Input
              id="announcementText"
              name="announcementText"
              defaultValue={settings.announcementText}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="announcementBackgroundColor">Couleur de fond</Label>
              <Input
                id="announcementBackgroundColor"
                name="announcementBackgroundColor"
                type="color"
                defaultValue={toColorInput(settings.announcementStyle.backgroundColor)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="announcementTextColor">Couleur du texte</Label>
              <Input
                id="announcementTextColor"
                name="announcementTextColor"
                type="color"
                defaultValue={toColorInput(settings.announcementStyle.textColor)}
                disabled={isPending}
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer la banniere"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function toColorInput(value: string) {
  if (value.startsWith("#")) {
    return value;
  }

  return "#171412";
}
