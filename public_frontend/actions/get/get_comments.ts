"use server"

const API_URL = process.env.API_URL!;

export async function getComments(page : number = 1){

    const resPages = await fetch(`${API_URL}/api/v1/comments/?page=${page}`, {

    })

    if (!resPages.ok){return null}

    const data = await resPages.json();
    return data;
}
