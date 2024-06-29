// import React from "react";
// import {
//   createMemoryRouter,
//   createRoutesFromElements,
//   Route,
// } from "react-router-dom";

// export const makeRouter = () =>
//   createMemoryRouter(
//     createRoutesFromElements(
//       <Route
//         id="root"
//         path="/"
//         element={<CategoryList routeId={rootRouteId} />}
//       >
//         {/* Actual route */}
//         <Route
//           id="category-details"
//           path="/:id"
//           element={
//             <NestedPanel routeId="category-details">
//               <CategoryDetails />
//             </NestedPanel>
//           }
//         >
//           <Route
//             id="widgets"
//             path="widgets/:widgetIid"
//             element={
//               <NestedPanel routeId="widgets">
//                 <WidgetList />
//               </NestedPanel>
//             }
//           />
//         </Route>
//       </Route>,
//     ),
//   );
