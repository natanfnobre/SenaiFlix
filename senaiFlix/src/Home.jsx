import { APIKEY } from "./config/key";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Movie, MovieList, SearchBar } from "./style";

function Home() {
    const img_path = "https://image.tmdb.org/t/p/w500/";
    const BASE_URL = "https://api.themoviedb.org/3"

    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [search, setSearch] = useState("");
    const [genero, setGenero] = useState("");
    const [cartaz, setCartaz] = useState("");
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tipoSelecionado = queryParams.get("tipo");

    useEffect(() => {
        setLoading(true);

        const fetchMovies = fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=pt-BR`,
        ).then((res) => res.json());

        const fetchSeries = fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=${APIKEY}&language=pt-BR`,
        ).then((res) => res.json());

        const fetchCartaz = fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}&language=pt-BR`,
        ).then((res) => res.json());

        Promise.all([fetchMovies, fetchSeries, fetchCartaz])
            .then(([movieData, seriesData, cartazData]) => {
                setMovies(movieData.results || []);
                setSeries(seriesData.results || []);
                setCartaz(cartazData.results || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados no servidor do TMDB:", error);
                setLoading(false);
            });
    }, []); // importante para não fazer loop infinito

    const filtrar = (lista) => {
        return lista.filter((item) => {
            const nomeDoItem = (item.title || item.name).toLowerCase();
            const matchesSearch = nomeDoItem.includes(search.toLowerCase());

            const matchesGenre =
                genero === "" || item.genre_ids.includes(Number(genero));
            return matchesSearch && matchesGenre;
        });
    };

    return (
        <Container>
            <SearchBar>
                <div className="field-group">
                    <label>O QUE VOCE PROCURA</label>
                    <input
                        type="text"
                        placeholder="Ex Batman, Matrix, Avengers"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="field-group">
                    <label>GENERO</label>
                    <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                        <option value="">Todos os Gêneros</option>
                        <option value="28">Ação</option>
                        <option value="35">Comédia</option>
                        <option value="18">Drama</option>
                        <option value="27">Terror</option>
                    </select>
                </div>
                <button className="btn-limpar" onClick={() => {
                    setSearch('');
                    setGenero('')
                }}>Limpar Filtros</button>
            </SearchBar>


            {(!tipoSelecionado || tipoSelecionado === 'movie') && filtrar(movies).length > 0 && (
                <>
                    <h2>Filmes Populares</h2>

                    <MovieList>
                        {filtrar(movies).map(movie => (
                            <Movie key={movie.id}>
                                <Link to={`/details/movie/${movie.id}`}>
                                    <img src={`${img_path}${movie.poster_path}`} alt={movie.title} />
                                </Link>
                                <span>{movie.title}</span>
                            </Movie>
                        ))}
                    </MovieList>

                </>
            )}

            {(!tipoSelecionado || tipoSelecionado === 'tv') && filtrar(movies).length > 0 && (
                <>
                    <h2>Series Populares</h2>

                    <MovieList>
                        {filtrar(series).map(serie => (
                            <Movie key={serie.id}>
                                <Link to={`/details/movie/${serie.id}`}>
                                    <img src={`${img_path}${serie.poster_path}`} alt={serie.title} />
                                </Link>
                                <span>{serie.title}</span>
                            </Movie>
                        ))}
                    </MovieList>

                </>
            )}

            <h2>Filmes Em cartaz</h2>

            <MovieList>
                {filtrar(cartaz).map(cartaz => (
                    <Movie key={cartaz.id}>
                        <Link to={`/details/movie/${cartaz.id}`}>
                            <img src={`${img_path}${cartaz.poster_path}`} alt={cartaz.title} />
                        </Link>
                        <span>{cartaz.title}</span>
                    </Movie>
                ))}
            </MovieList>
        </Container>
    );
}

export default Home;
