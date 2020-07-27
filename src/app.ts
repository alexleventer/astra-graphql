import fetch from 'cross-fetch';
import {getAstraToken} from './utils';
const {ASTRA_DB_ID, ASTRA_DB_REGION} = process.env;

const main = async () => {
  // Fields Example
  const FIELDS_EXAMPLE_QUERY = `
    {
      characters {
        values {
          id,
          name,
          housename
        }
      }
    }
  `;
  const fieldsExample = await request(FIELDS_EXAMPLE_QUERY);

  // Arguments Example
  const ARGUMENTS_EXAMPLE_QUERY = `
    {
      characters(value: {name: "Jon Snow"}) {
        values {
          id,
          name,
          housename
        }
      }
    }
  `;
  const argumentsExample = await request(ARGUMENTS_EXAMPLE_QUERY);

  // Aliases Example
  const ALIASES_QUERY = `
    {
      winner: characters(value: {name: "Jon Snow"}) {
        values {
          id,
          name,
          housename
        }
      }
      loser: characters(value: {name: "Tyrion Lannister"}) {
        values {
          id,
          name,
          housename
        }
      }
    }
  `;
  const aliasesExample = await request(ALIASES_QUERY);

  // Fragments Example
  const FRAGMENTS_QUERY = `
    {
      leftComparison: characters(value: {name: "Jon Snow"}) {
        ...comparisonFields
      }
      rightComparison: characters(value: {name: "Tyrion Lannister"}) {
        ...comparisonFields
      }
    }
    fragment comparisonFields on CharactersResult {
      values {
        id,
        name
      }
    }
  `;
  const framentsExample = await request(FRAGMENTS_QUERY);

  // Variables Example
  const VARIABLES_QUERY = `
    {
      query CharacterByName(value: $value:{name: String!}) {
        characters(value:$value) {
          values {
            id,
            name,
            housename
          }
        }
      }
    }
  `;

  const variables = {
    value: {
      name: 'Jon Snow'
    },
  }

  const variablesExample = await request(VARIABLES_QUERY, variables);
}

export const request = async (query, variables?): Promise<any> => {
  const endpoint = `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/graphql`;
  const result: Response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Cassandra-Token': await getAstraToken(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return result.json();
};

main().catch((error) => console.error(error));
