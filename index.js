import { h, app } from 'hyperapp';
import { pipe, invoker, take } from 'ramda';

import 'bulma/css/bulma.css';

// returns a random number
const random = (max = 1000000) => Math.floor(Math.random() * Math.floor(max));

// uses the github api to fetch 30 users starting with the userid provided by the since parameter
const fetchGithubUserSince = since =>
  fetch(`https://api.github.com/users?since=${since}`);

// combine random and fetchGithubUserSince to fetch random users
const fetchRandomGithubUser = pipe(random, fetchGithubUserSince);

// this helper invokes the .json() method on the given object => invokeJson(foo) -> foo.json()
const invokeJson = invoker(0, 'json');

// take10 entries from an array
const take10 = take(10);

// get github url of a user
const githubUrl = username => `https://github.com/${username}`;

const state = {
  users: []
};

const actions = {
  fetchUsers: () => (state, actions) =>
    fetchRandomGithubUser()
      .then(invokeJson)
      .then(take10)
      .then(actions.fetchDone),
  fetchDone: users => ({ users })
};

const UserComponent = ({ user }) => (
  <div class="column is-one-fifth">
    <div class="box has-text-centered">
      <a href={githubUrl(user.login)} target="_blank">
        <p class="is-size-4">{user.login}</p>
        <img width="128" src={user.avatar_url} alt="" />
      </a>
    </div>
  </div>
);

const FetchButton = ({ fetch }) => (
  <button class="button" onclick={fetch}>
    Fetch random users
  </button>
);

const view = (state, actions) => (
  <div oncreate={actions.fetchUsers}>
    <h1 class="title">hyperapp + parcel experiment</h1>
    <h2>
      <FetchButton fetch={actions.fetchUsers} />
    </h2>
    <div class="container" style={{ margin: '10px', padding: '10px' }}>
      <div class="columns is-multiline is-2 is-variable">
        {state.users.map(u => <UserComponent key={u.id} user={u} />)}
      </div>
    </div>
  </div>
);
app(state, actions, view, document.body);
