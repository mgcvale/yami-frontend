export function formatRelativeTime(ageInDays: number): string {
    if (ageInDays < 1) {
        return "hoje"; 
    }

    if (ageInDays < 7) {
        return ageInDays === 1 ? "um dia atrás" : `${ageInDays} dias atrás`;
    }
    
    if (ageInDays < 30) {
        const weeks = Math.floor(ageInDays / 7);
        return weeks === 1 ? "uma semana atrás" : `${weeks} semanas atrás`;
    }
    
    if (ageInDays < 365) {
        const months = Math.floor(ageInDays / 30);
        return months === 1 ? "um mês atrás" : `${months} meses atrás`;
    }

    const years = Math.floor(ageInDays / 365);
    return years === 1 ? "um ano atrás" : `${years} anos atrás`;
}
