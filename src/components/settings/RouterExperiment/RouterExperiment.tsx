import React, { useEffect, useMemo } from "react";
import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useParams,
} from "react-router-dom";

import { NestedPanel } from "../../nestedNavigation/NestedPanel";
import { RootWrapper } from "../../nestedNavigation/RootWrapper";
import { SafeLink } from "../../nestedNavigation/SafeLink";

const rootRouteId = "root";

function CategoryList() {
  return (
    <>
      <h1>Categories</h1>
      <div>
        <SafeLink to="/1">Category 1</SafeLink>
      </div>
      <div>
        <SafeLink to="/2">Category 2</SafeLink>
      </div>
      <div>
        <SafeLink to="/3">Category 3</SafeLink>
      </div>
      <div>
        <SafeLink to="/4">Category 4</SafeLink>
      </div>
    </>
  );
}

function CategoryDetails() {
  const { id } = useParams();
  const [text, setText] = React.useState("Hello from CardDetails");
  useEffect(() => {
    setText(`Hello from CategoryDetails ${id}`);
  }, [id]);
  return (
    <>
      <h1>Category {id}</h1>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <h3>Widgets</h3>
      <div>
        <SafeLink to="widgets/1">Widget 1</SafeLink>{" "}
      </div>
      <div>
        <SafeLink to="widgets/2">Widget 2</SafeLink>{" "}
      </div>
      <div>
        <SafeLink to="widgets/3">Widget 3</SafeLink>{" "}
      </div>
      <div>
        <SafeLink to="widgets/4">Widget 4</SafeLink>{" "}
      </div>
    </>
  );
}

function WidgetList() {
  const { widgetIid } = useParams();
  return (
    <div>
      <h1>Widget {widgetIid}</h1>
    </div>
  );
}

const makeRouter = () =>
  createMemoryRouter(
    createRoutesFromElements(
      <Route
        id="root"
        path="/"
        element={
          <RootWrapper routeId={rootRouteId}>
            <CategoryList />
          </RootWrapper>
        }
      >
        {/* Actual route */}
        <Route
          id="category-details"
          path="/:id"
          element={
            <NestedPanel routeId="category-details">
              <CategoryDetails />
            </NestedPanel>
          }
        >
          <Route
            id="widgets"
            path="widgets/:widgetIid"
            element={
              <NestedPanel routeId="widgets">
                <WidgetList />
              </NestedPanel>
            }
          />
        </Route>
      </Route>,
    ),
  );

export function RouterExperiment() {
  const router = useMemo(makeRouter, []);
  return <RouterProvider router={router} />;
}
