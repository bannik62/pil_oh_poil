import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('p').forEach((p) => observer.observe(p));




const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
