import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="bg-gray-100 rounded-lg shadow-md px-6 py-3 mb-6">
      <ol className="flex items-center text-sm text-gray-700">
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {isLast ? (
                <span className="font-semibold text-blue-700 capitalize">
                  {name.replace(/-/g, " ")}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-blue-600 transition-colors capitalize font-medium"
                >
                  {name.replace(/-/g, " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
