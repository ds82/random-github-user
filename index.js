import { h, app } from 'hyperapp';

const state = {};
const actions = {};

const view = (state, actions) => <h1>Hello Hyperapp</h1>;

app(state, actions, view, document.body);
