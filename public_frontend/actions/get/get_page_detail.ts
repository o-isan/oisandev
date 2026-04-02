"use server"

const API_URL = process.env.API_URL!;

export async function getPageDetail(category : String, slug : String){

    const resPages = await fetch(`${API_URL}/api/v1/pages/${slug}?category=${category}`, {
        cache: "no-store"
    })

    if (!resPages.ok){return null}

    const page = await resPages.json();
    return page;
}
