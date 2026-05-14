export async function RetrieveLocation(town, voivod){
    const address = `${town}, województwo ${voivod}, Poland`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return data[0]
        } else {
        return "Location not found";
        }
    } catch (err) {
        return err.message;
    }
}

