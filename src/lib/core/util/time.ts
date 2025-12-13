export function formatRelativeTime(ageInDays: number): string {
    if (ageInDays < 1) {
        return "today"; 
    }

    if (ageInDays < 7) {
        return ageInDays === 1 ? "1 day ago" : `${ageInDays} days ago`;
    }
    
    if (ageInDays < 30) {
        const weeks = Math.floor(ageInDays / 7);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    
    if (ageInDays < 365) {
        const months = Math.floor(ageInDays / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    const years = Math.floor(ageInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
}
