import { Octokit } from 'octokit';
import { GraphQLClient, gql } from 'graphql-request';
import axios from 'axios';

const API_KEY = '55027109427c6feac223bc5b1ce4918fe459d88071bcc00e3cc696a398c1eeb8';
const API_GIT = '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';
const projects = [
  'comments',
  'job-list',
  'articles',
  'kickstarter',
  'appWeather',
  'Vocabulary',
  'NFT',
  'OOP',
  'List-of-users',
  'my-bike-landing',
  'Air-landing',
  'museum-landing',
  'todo',
];

const contentBoxSlider = document.querySelector('.slider__content');
const buttonNext = document.querySelector('.slider__arrow-next-button-box');
const buttonPrev = document.querySelector('.slider__arrow-prev-button-box');
let currentPosition = 0;
const step = 400;
buttonNext.addEventListener('click', () => {
  if (currentPosition <= -1 * (contentBoxSlider.childElementCount - 1) * step) {
    buttonNext.style.disabled = 'true';
    buttonNext.style.opacity = '0.3';
    return;
  }
  currentPosition -= step;
  buttonNext.style.opacity = '1';
  buttonNext.style.disabled = 'false';
  contentBoxSlider.style.transitionDuration = '0.5s';
  contentBoxSlider.style.transform = `translateX(${currentPosition}px)`;
});

buttonPrev.addEventListener('click', () => {
  if (currentPosition > -400) {
    buttonPrev.style.disabled = 'true';
    buttonPrev.style.opacity = '0.3';
    return;
  }
  currentPosition += step;
  buttonPrev.style.opacity = '1';
  buttonPrev.style.disabled = 'false';
  contentBoxSlider.style.transitionDuration = '0.5s';
  contentBoxSlider.style.transform = `translateX(${currentPosition}px)`;
});

function accord(array, classActiveName) {
  for (let i = 0; i < array.length; i += 1) {
    array[i].addEventListener('click', function accordion() {
      this.classList.toggle(`${classActiveName}`);

      const panel = document.querySelector(`.details__panel-${i + 1}`);
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  }
}

function requestHTMLReadme(repo, outDiv) {
  //https://${token}@github.com/${owner}/${repo}.git
  const apiRoot = `https://api.github.com`;
  const myUser = 'vlasiuk-anatolii';
  const myRepo = `${repo}`;
  const boxOut = outDiv;
  const request = new XMLHttpRequest();
  request.open('GET', `${apiRoot}/repos/${myUser}/${myRepo}/readme`);
  request.setRequestHeader('Accept', 'application/vnd.github.v3.html');
  request.setRequestHeader('Authorization', `Bearer ${API_GIT}`); //'Bearer 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');
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      boxOut.innerHTML = request.response;
    }
  };
  request.send();
}

async function getRepoInfo(repo) {
  const endpoint = 'https://api.github.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${API_GIT}`//'Bearer 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',
    },
  });

  const query = gql`
  {
    repository(owner: "vlasiuk-anatolii", name: "${repo}") {
      createdAt
      openGraphImageUrl
      description
      url
      name
     
      languages(first:5) {
       totalCount
        totalSize
        edges {
          size
          node {
            color
            name
          }
        }
      }
      repositoryTopics(first:20) {
        edges {
          node {
            resourcePath
          }
        }
      }
    } 
  }
  `;
  const data = await graphQLClient.request(query);
  return data;
}

function getFormatDate(date) {
  const currDate = new Date(date);
  const day = currDate.getUTCDate();
  let strday = day.toString();

  if (strday.length === 1) {
    strday = `${0}${day}`;
  }

  const month = currDate.getMonth() + 1;
  let strmonth = month.toString();

  if (strmonth.length === 1) {
    strmonth = `${0}${strmonth}`;
  }

  const year = currDate.getFullYear();

  const hours = currDate.getHours();
  let strhours = hours.toString();

  if (strhours.length === 1) {
    strhours = `${0}${strhours}`;
  }

  const minutes = currDate.getMinutes();

  let strminutes = minutes.toString();

  if (strminutes.length === 1) {
    strminutes = `${0}${strminutes}`;
  }

  return `${strday}.${strmonth}.${year} at ${strhours}:${strminutes}`;
}

function getAllTopicsToStr(arr) {
  let resString = '';
  const mappedArray = arr.map((item) => item.node.resourcePath.replace(/\/topics\//, ''));
  resString = mappedArray.join(', ');

  return resString;
}
const modalImgBox = document.querySelector('.modal');

function createCard(
  title,
  created,
  urlImg,
  urlToRepo,
  describe,
  arrLanguage,
  totalSize,
  topics,
) {
  const cardBox = document.createElement('div');
  cardBox.classList.add('slider__card');
  const h3 = document.createElement('h3');
  h3.classList.add('slider__title-card');
  h3.innerText = `${title.toUpperCase()}`;
  const h4 = document.createElement('h4');
  h4.classList.add('slider__created');
  h4.innerText = `Created: ${getFormatDate(created)}`;
  const img = document.createElement('img');
  img.classList.add('slider__img');
  img.setAttribute('src', `${urlImg}`);
  img.setAttribute('title', 'Press to show image bigger');
  img.setAttribute('alt', 'img');
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    modalImgBox.classList.toggle('modal--active');
    document.querySelector('.modal__img').src = `${urlImg}`;
  });
  const p = document.createElement('p');
  p.classList.add('slider__discribe');
  p.innerText = `${describe}`;
  const buttonImg = document.querySelector('.modal__button-img');
  buttonImg.addEventListener('click', () => {
    window.location.href = `${urlToRepo}`;
  });
  const ptotalSize = document.createElement('p');
  ptotalSize.classList.add('slider__total-size');
  ptotalSize.innerText = `Size: ${totalSize}B`;
  cardBox.appendChild(h3);
  cardBox.appendChild(h4);
  cardBox.appendChild(img);
  cardBox.appendChild(p);
  cardBox.appendChild(ptotalSize);
  const lengBox = document.createElement('div');
  lengBox.classList.add('slider__language-box');
  const lengList = document.createElement('ul');
  lengList.classList.add('slider__language-list');
  lengBox.appendChild(lengList);
  arrLanguage.forEach((element) => {
    const li = document.createElement('li');
    li.classList.add('slider__language-item');
    li.innerText = `${element.node.name}: `;
    const span = document.createElement('span');
    span.classList.add('slider__language-item-percent');
    span.innerText = `${(Math.trunc((element.size / totalSize) * 1000)) / 10}%`;
    span.style.color = `${element.node.color}`;
    span.style.float = 'right';
    li.appendChild(span);
    lengBox.appendChild(li);
  });
  const topicsBox = document.createElement('div');
  topicsBox.classList.add('slider__topics');
  topicsBox.innerText = `Topics: ${getAllTopicsToStr(topics)}`;
  cardBox.appendChild(lengBox);
  cardBox.appendChild(topicsBox);
  const arrowDown = document.createElement('div');
  arrowDown.style.width = '48px';
  arrowDown.style.height = '48px';

  arrowDown.style.backgroundImage = 'url(arrow-down.svg)';
  arrowDown.style.backgroundSize = 'contain';
  arrowDown.style.backgroundRepeat = 'no-repeat';
  arrowDown.style.backgroundPosition = 'center';
  arrowDown.style.cursor = 'pointer';
  arrowDown.style.margin = '0 auto';
  arrowDown.setAttribute('title', 'To the details');
  const link = document.createElement('a');
  link.style.display = 'block';
  link.setAttribute('href', `#${title.toLowerCase()}`);
  link.style.width = '100%';
  link.style.height = '100%';
  arrowDown.append(link);
  cardBox.appendChild(arrowDown);
  return cardBox;
}

modalImgBox.addEventListener('click', () => {
  modalImgBox.classList.toggle('modal--active');
});

const sliderBox = document.querySelector('.slider__content');

projects.forEach((item) => {
  getRepoInfo(`${item}`)
    .then((res) => {
      sliderBox.appendChild(createCard(
        res.repository.name,
        res.repository.createdAt,
        res.repository.openGraphImageUrl,
        res.repository.url,
        res.repository.description,
        res.repository.languages.edges,
        res.repository.languages.totalSize,
        res.repository.repositoryTopics.edges,
      ));
    })
    .catch((error) => new Error(error));
});

function createAccordion(num, name) {
  const accordionBox = document.createElement('div');
  accordionBox.setAttribute('id', `${name.toLowerCase()}`);
  accordionBox.classList.add('details__project');
  const h3 = document.createElement('h3');
  h3.classList.add('details__subtitle');
  h3.innerText = `#${num}: ${name.toUpperCase()}`;
  const arrowBox = document.createElement('div');
  arrowBox.classList.add('details__arrow_box', 'accordion');
  const panelBox = document.createElement('div');
  panelBox.classList.add(`details__panel-${num}`, 'details__panel');
  const p = document.createElement('p');
  p.classList.add('details__main-info');
  panelBox.append(p);
  accordionBox.append(h3);
  h3.append(arrowBox);
  accordionBox.append(panelBox);

  return accordionBox;
}

const title = document.querySelector('.details__title');
projects.forEach((item, i) => {
  const acc = createAccordion(i + 1, `${item}`);
  title.append(acc);
  const panelOut = acc.querySelector('.details__main-info');
  requestHTMLReadme(`${item}`, panelOut);
});

const acc = document.getElementsByClassName('accordion');
accord(acc, 'details__arrow_box-active');
document.querySelector('.details__button').addEventListener('click', () => {
  window.location.href = 'https://github.com/vlasiuk-anatolii';
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  axios({
    method: 'POST',
    url: `https://api.mailslurp.com/sendEmail?apiKey=${API_KEY}`,
    data: {
      senderId: '87bfe064-b358-4fd9-ae66-32fedbf352d8',
      to: 'vlasyuk_a@ukr.net',
      subject: 'About portfolio',
      body: `Name: ${form[0].value}, E-mail: ${form[1].value}, Text message: ${form[2].value}`,
    },
  }).then((res) => {
    console.log(res);
    if (res.status === 201) {
      form[0].value = '';
      form[1].value = '';
      form[2].value = 'Your message has been succssefully sent!!!';
      setTimeout(() => {
        form[2].value = '';
      }, 5000);
    }
  })
    .catch((err) => {
      form[2].value = `${err}`;
    });
});
