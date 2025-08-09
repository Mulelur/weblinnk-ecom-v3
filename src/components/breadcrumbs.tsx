import { limitText } from "@/lib/utils";

type Props = {
  crumb: string;
  linkProducts: string;
  linkHome: string;
};

export default function Breadcrumbs({ crumb, linkProducts }: Props) {
  return (
    <nav className="flex">
      <ol role="list" className="flex items-center">
        <li className="text-left">
          <div className="flex items-center">
            <div className="-m-1">
              <a
                href={linkProducts}
                className="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
              >
                Products{" "}
              </a>
            </div>
          </div>
        </li>
        <li className="text-left">
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <div className="-m-1">
              <a
                href="#"
                className="rounded-md p-1 text-sm font-medium text-gray-600 hover:text-gray-800 focus:text-gray-900 focus:shadow"
                aria-current="page"
              >
                {limitText(crumb, 15)}
              </a>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  );
}
