import Header from "../Header";
import Footer from "../footer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIKEY } from "../config/key";
import { Container } from "../style";

function Details() {
    const img_path = "https://image.tmdb.org/t/p/w500/";
    const { type, id } = useParams()
    const [content, setContent] = useState(null)
    const [trailerkey, setTrailerkey] = useState(null)
    const [cast, setCast] = useState(null)
    const [genres, setGenres] = useState(null)
    const [isFavorite, setFavorite] = useState(false)

    useEffect(() => {
        async function fetchContent() {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}?api_key=${APIKEY}&language=pt-BR`
                )
                const data = await response.json()
                setContent({
                    id,
                    title: data.title || data.name,
                    overview: data.overview,
                    releaseDate: data.release_date || data.first_air_date,
                    poster: data.poster_path,
                    rating: data.vote_average
                })
                setGenres(data.genres || [])

                const videosResponse = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${APIKEY}&language=pt-BR`
                )

                const videosData = await videosResponse.json()
                if (videosData.results) {
                    const trailer = videosData.results.find(video => video.type === 'Trailer' && v.site === 'Youtube')
                    if (trailer) setTrailerkey(trailer.key)
                }

                const creditsResponse = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${APIKEY}&language=pt-BR`
                )
                const creditsData = await creditsResponse.json()
                if (creditsData.cast) setCast(creditsData.cast.slice(0, 8))
            }
            catch {
                console.log("Erro ao buscar detalhes", Error);
            }
            return (
                <>
                    <Header />
                    <Container>
                        {!content && <p>Carregando detalhes...</p>}
                        {content && (
                            <>
                                <div className="details">
                                    <img
                                        src={content.poster ? `${img_path}${content.poster}` : 'https://placehold.co/300x450'}
                                        alt={content.title}
                                    />
                                    <div className="info">
                                        <h1>{content.title}</h1>
                                    </div>
                                </div>
                            </>
                        )}
                    </Container>
                    <Footer />
                </>
            )
        }
    })
}
export default Details