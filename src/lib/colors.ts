
/**
 * Converts an HSL string to a HEX string.
 * @param hslStr - HSL color string (e.g. "hsl(0, 100%, 50%)")
 * @returns HEX color string (e.g. "#FF0000")
 */
export const hslToHex = (hslStr: string): string => {
    const match = hslStr.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';

    const [h, s, l] = match.map(Number);
    const hVal = h / 360;
    const sVal = s / 100;
    const lVal = l / 100;

    let r, g, b;
    if (sVal === 0) {
        r = g = b = lVal;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
        const p = 2 * lVal - q;
        r = hue2rgb(p, q, hVal + 1 / 3);
        g = hue2rgb(p, q, hVal);
        b = hue2rgb(p, q, hVal - 1 / 3);
    }

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const generateRandomPalette = (): string[] => {
    const baseH = Math.floor(Math.random() * 360);
    return [
        `hsl(${baseH}, 70%, 50%)`,
        `hsl(${(baseH + 30) % 360}, 65%, 45%)`,
        `hsl(${(baseH + 60) % 360}, 60%, 40%)`,
        `hsl(${(baseH + 180) % 360}, 70%, 50%)`,
        `hsl(${(baseH + 210) % 360}, 65%, 45%)`,
    ];
};
