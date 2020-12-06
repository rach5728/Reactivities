import { Icon, Header } from 'semantic-ui-react'
import './App.css';

function App() {
  return (
      <div>
          <Headers as='h2'>
              <Icon name='plug' />
              <Header.Content>Reactivities Header</Header.Content>
          </Headers>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
    </div>
  );
}

export default App;
