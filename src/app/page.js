import Link from 'next/link'

export default async function Home() {

    const pokemonList = await fetchPokemonList(1000)

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Pocket Monster Database</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pokemonList.map((pokemon) => (
                    <Link
                        href={`/monsters/${pokemon.id}`}
                        key={pokemon.id}
                        className="pokemon-card bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg"
                    >
                        <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-32 h-32 object-contain"
                        />
                        <h2 className="text-xl font-semibold mt-2 capitalize">{pokemon.name}</h2>
                        <p className="text-gray-600">#{pokemon.id.toString().padStart(3, '0')}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

async function fetchPokemonList(limit =1000) {
    const pokemonList = []

    for (let i = 1; i <= limit; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        const data = await response.json()

        pokemonList.push({
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
        })
    }

    return pokemonList
}

export async function generateStaticParams() {
    const pokemonList = await fetchPokemonList(1000)

    return pokemonList.map((pokemon) => ({
        id: pokemon.id.toString()
    }))
}