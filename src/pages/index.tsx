import algoliasearch from 'algoliasearch/lite';
import { Hits, InstantSearch, SearchBox, Highlight } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_AGL_APPID!, process.env.NEXT_PUBLIC_ADMIN_API_KEY!);

export default function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName="test_index"> 
      <SearchBox  placeholder='Search here'/>
      <Hits  />
    </InstantSearch>
  );
}
