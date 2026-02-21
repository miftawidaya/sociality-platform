export type SiteConfig = {
  readonly name: string;
  readonly role: string;
  readonly techStack: string;
  readonly shortDescription: string;
  readonly fullDescription: string;
  readonly url: string;
  readonly ogImage: string;
  readonly links: {
    readonly twitter: string;
    readonly github: string;
  };
};
