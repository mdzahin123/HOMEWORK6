import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './pokemon-detail.module.css'


const fetchPokemonData = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        next: { revalidate: 60 }
    })
    if (!response.ok) return null
    return response.json()
}

export default async function PokemonDetail({ params }) {
    const pokemon = await fetchPokemonData(params.id)
    if (!pokemon) notFound()


    const {
        id,
        name,
        types,
        height,
        weight,
        base_experience,
        abilities,
        stats,
        sprites
    } = pokemon

    const primaryType = types[0]?.type?.name || 'normal'
    const typeColor = getTypeColor(primaryType)
    const isLastPokemon = id >= 1000

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Pokémon List
            </Link>

            <div className={styles.pokemonCard} style={{ '--type-color': typeColor }}>
                <div className={styles.pokemonHeader}>
                    <div className={styles.headerContent}>
                        <span className={styles.pokemonId}>#{id.toString().padStart(3, '0')}</span>
                        <h1 className={styles.pokemonName}>{name}</h1>
                        <div className={styles.typeBadges}>
                            {types.map((type) => (
                                <span
                                    key={type.type.name}
                                    className={styles.typeBadge}
                                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                                >
                  {type.type.name}
                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.imageSection}>
                        <img
                            src={sprites.other['official-artwork'].front_default || sprites.front_default}
                            alt={name}
                            className={styles.mainImage}
                            loading="lazy"
                            width={256}
                            height={256}
                        />

                        <div className={styles.additionalImages}>
                            {sprites.front_shiny && (
                                <img
                                    src={sprites.front_shiny}
                                    alt={`Shiny ${name}`}
                                    className={styles.additionalImage}
                                    title="Shiny variant"
                                    width={64}
                                    height={64}
                                    loading="lazy"
                                />
                            )}
                            {sprites.back_default && (
                                <img
                                    src={sprites.back_default}
                                    alt={`${name} back view`}
                                    className={styles.additionalImage}
                                    title="Back view"
                                    width={64}
                                    height={64}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsSection}>
                        <div className={styles.detailGrid}>
                            <div>
                                <p className={styles.detailLabel}>Height</p>
                                <p className={styles.detailValue}>{(height / 10).toFixed(1)} m</p>
                            </div>
                            <div>
                                <p className={styles.detailLabel}>Weight</p>
                                <p className={styles.detailValue}>{(weight / 10).toFixed(1)} kg</p>
                            </div>
                            <div>
                                <p className={styles.detailLabel}>Base Exp</p>
                                <p className={styles.detailValue}>{base_experience || 'N/A'}</p>
                            </div>
                        </div>

                        <div className={styles.abilitiesContainer}>
                            <h2 className={styles.sectionTitle}>Abilities</h2>
                            <div className={styles.abilityBadges}>
                                {abilities.map((ability) => (
                                    <span
                                        key={ability.ability.name}
                                        className={styles.abilityBadge}
                                    >
                    {ability.ability.name.replace('-', ' ')}
                                        {ability.is_hidden && <span className={styles.hiddenAbility}>(hidden)</span>}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className={styles.sectionTitle}>Stats</h2>
                            <div className={styles.statsContainer}>
                                {stats.map((stat) => (
                                    <div key={stat.stat.name} className={styles.statContainer}>
                                        <div className={styles.statHeader}>
                                            <span className={styles.statName}>{stat.stat.name.replace('-', ' ')}</span>
                                            <span className={styles.statValue}>{stat.base_stat}</span>
                                        </div>
                                        <div className={styles.statBarContainer}>
                                            <div
                                                className={styles.statBar}
                                                style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.navigationButtons}>
                {id > 1 ? (
                    <Link
                        href={`/monsters/${id - 1}`}
                        className={styles.navButton}
                        prefetch={true}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Previous Pokémon
                    </Link>
                ) : (
                    <div className={`${styles.navButton} ${styles.disabledButton}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Previous Pokémon
                    </div>
                )}

                {!isLastPokemon ? (
                    <Link
                        href={`/monsters/${id + 1}`}
                        className={styles.navButton}
                        prefetch={true}
                    >
                        Next Pokémon
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                ) : (
                    <div className={`${styles.navButton} ${styles.disabledButton}`}>
                        Next Pokémon
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    )
}


function getTypeColor(type) {
    const colors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    }
    return colors[type.toLowerCase()] || '#A8A878'
}

export async function generateStaticParams() {
    return Array.from({ length: 1000 }, (_, i) => ({
        id: (i + 1).toString()
    }))
}