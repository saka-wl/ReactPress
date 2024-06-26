import { Feature } from 'shared/types';
// import styles from './index.module.scss';

function getFeatureWidth(len) {
  if (len % 4 === 0) return 4;
  if (len % 3 === 0) return 3;
  if (len % 2 === 0) return 2;
  return 3;
}

export function HomeFeature(props: { features: Feature[] }) {
  const featureWidth = getFeatureWidth(props.features.length);
  return (
    // justify="between"    flex-row   w={'1/' + featureWidth}
    <div className="max-w-1152px flex-row" m="auto" flex="~ wrap">
      {props.features.map((feature) => {
        const { icon, title, details } = feature;
        return (
          <div
            key={title}
            className="cursor-pointer"
            border="rounded-md"
            p="r-4 b-4"
            // w='1/3'
            w={'1/' + featureWidth}
          >
            <article
              bg="bg-soft"
              border="~ bg-soft none rounded-xl"
              p="6"
              h="full"
            >
              {/* bg-white   gray-light-1  */}
              <div
                bg="gray-light-4 dark:brandDark"
                border="rounded-md"
                className="mb-5 w-12 h-12 text-3xl flex-center"
              >
                {icon}
              </div>
              <h2 font="bold">{title}</h2>
              <p text="sm text-2" font="medium" className="pt-2 leading-6">
                {details}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
