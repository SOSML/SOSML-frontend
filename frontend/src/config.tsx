export interface CustomLink {
    text: string; // The display text of the link
    href: string; // The target location of the link
}

export interface Configuration {
    sharingEnabled: boolean;
    customLinks: CustomLink[];
}

let config: Configuration = {
    // Enable or disable sharing
    sharingEnabled: false,
    /*
    It is possible to add custom links to the navigation menu.
    The objects should have the format of the CustomLink interface above.
    For example:
    {
        text: "Example",
        href: "https://example.com"
    }
    The custom links are placed inbetween the 'Files' and 'Help' links.
    */
    customLinks: []
};

export let CONFIG = config;
