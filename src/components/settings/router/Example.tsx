/* eslint-disable @typescript-eslint/no-unused-vars */
// /////////////////////////////////////////////////////////////////////////////
// Example
import {
  createDirection,
  Link,
  Route,
  Router,
  useParams,
} from "@lumphammer/minirouter";
import { SlideInOutlet } from "@lumphammer/minirouter/animated";
import React from "react";

import { NestedPanel } from "./NestedPanel";
import { SlideInNestedPanelRoute } from "./SlideInNestedPanelRoute";

// Components

const aboutDirection = createDirection("about");
const contactDirection = createDirection("contact");
const cardsDirection = createDirection("cards");
const cardsDetailsDirection = createDirection<number>("cardsDetails");

const About: React.FC = () => {
  return (
    <div>
      <h1>About</h1>
      <p>
        We are a fast-growing company. We have a lot of exciting things in the
        works. We are looking for talented people to join our team. We were
        founded in 2023 by a group of friends who were looking for a new way to
        make a living. Our core values are:
        <ul>
          <li>Encourage creativity</li>
          <li>Provide a safe and supportive environment</li>
          <li>Lead by example</li>
        </ul>
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i}>{i}</p>
        ))}
      </p>
    </div>
  );
};

const Contact: React.FC = () => {
  return (
    <div>
      <h1>Contact</h1>
      <p>
        You can contact us at{" "}
        <a href="mailto:info@lumphammer.com">info@lumphammer.com</a>.
      </p>
    </div>
  );
};

const CardDetails: React.FC = () => {
  const id = useParams(cardsDetailsDirection);
  return (
    <div>
      <h1>Card Details</h1>
      <p>{id}</p>
    </div>
  );
};

const Cards: React.FC = () => {
  return (
    <div>
      <h1>Cards</h1>
      <ul>
        <li>
          <Link from="here" to={cardsDetailsDirection(1)}>
            Card 1
          </Link>
        </li>
        <li>
          <Link from="here" to={cardsDetailsDirection(2)}>
            Card 2
          </Link>
        </li>
        <li>
          <Link from="here" to={cardsDetailsDirection(3)}>
            Card 3
          </Link>
        </li>
        <li>
          <Link from="here" to={cardsDetailsDirection(4)}>
            Card 4
          </Link>
        </li>
        <li>
          <Link from="here" to={cardsDetailsDirection(5)}>
            Card 5
          </Link>
        </li>
      </ul>
      <SlideInNestedPanelRoute direction={cardsDetailsDirection}>
        <CardDetails />
      </SlideInNestedPanelRoute>
    </div>
  );
};

export const ExampleApp: React.FC = () => {
  return (
    <Router>
      <h1>Root</h1>
      <div>
        <Link from="root" to={aboutDirection()}>
          [About]
        </Link>{" "}
        <Link from="root" to={cardsDirection()}>
          [Cards]
        </Link>{" "}
        <Link from="root" to={contactDirection()}>
          [Contact]
        </Link>{" "}
      </div>
      {/* <SlideInNestedPanelRoute direction={aboutDirection}>
        <About />
      </SlideInNestedPanelRoute>
      <SlideInNestedPanelRoute direction={contactDirection}>
        <Contact />
      </SlideInNestedPanelRoute>
      <SlideInNestedPanelRoute direction={cardsDirection}>
        <Cards />
      </SlideInNestedPanelRoute> */}

      <SlideInOutlet>
        <Route direction={aboutDirection}>
          <NestedPanel>
            <About />
          </NestedPanel>
        </Route>

        <Route direction={contactDirection}>
          <NestedPanel>
            <Contact />
          </NestedPanel>
        </Route>

        <Route direction={cardsDirection}>
          <NestedPanel>
            <Cards />
          </NestedPanel>
        </Route>
      </SlideInOutlet>
    </Router>
  );
};
