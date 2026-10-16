import React from 'react';
import { ScrollVelocity } from '../reactbits/ScrollVelocity.tsx';
import { Category } from '../../data/types.ts';

interface VelocityRibbonProps {
  categories: Category[];
}

export const VelocityRibbon: React.FC<VelocityRibbonProps> = ({ categories }) => {
  const categoryNames = categories.length > 0
    ? categories.map(c => c.name)
    : ['Casamentos', 'Pré-Wedding', 'Ensaios Autoriais', 'Destination Wedding', 'Elopements'];

  return (
    <section className="w-full overflow-hidden my-6 select-none" aria-label="Categorias em destaque">
      <ScrollVelocity
        texts={categoryNames}
        velocity={1.2}
      />
    </section>
  );
};
