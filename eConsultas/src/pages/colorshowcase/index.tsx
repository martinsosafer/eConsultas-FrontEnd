import Button from "../../components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ColorSystemShowcase = () => {
  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-semibold mb-8">Color System Showcase</h1>

      {/* Buttons Section */}
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <Button label="Primary Button" type="primary" onClick={() => {}} />
          <Button
            label="Secondary Button"
            type="secondary"
            onClick={() => {}}
          />
          <Button label="Accent Button" type="accent" onClick={() => {}} />
          <Button
            label="Secondary Accent"
            type="secondary-accent"
            onClick={() => {}}
          />
          <Button label="Danger Button" type="danger" onClick={() => {}} />
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            label="Disabled Primary"
            type="primary"
            onClick={() => {}}
            disabled
          />
          <Button
            label="Disabled Secondary"
            type="secondary"
            onClick={() => {}}
            disabled
          />
          <Button
            label="Full Width Button"
            type="primary"
            onClick={() => {}}
            fit
          />
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Colors */}
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Primary Colors</h3>
            <div className="h-20 bg-primary rounded-md flex items-end p-2">
              <span className="text-white">Primary Default</span>
            </div>
            <div className="h-20 bg-primary-hover rounded-md flex items-end p-2">
              <span className="text-white">Primary Hover</span>
            </div>
            <div className="h-20 bg-primary-light rounded-md flex items-end p-2">
              <span className="text-gray-700">Primary Light</span>
            </div>
            <div className="h-20 bg-primary-dark rounded-md flex items-end p-2">
              <span className="text-white">Primary Dark</span>
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Secondary Colors</h3>
            <div className="h-20 bg-secondary rounded-md flex items-end p-2">
              <span className="text-white">Secondary Default</span>
            </div>
            <div className="h-20 bg-secondary-hover rounded-md flex items-end p-2">
              <span className="text-white">Secondary Hover</span>
            </div>
            <div className="h-20 bg-secondary-light rounded-md flex items-end p-2">
              <span className="text-gray-700">Secondary Light</span>
            </div>
            <div className="h-20 bg-secondary-dark rounded-md flex items-end p-2">
              <span className="text-white">Secondary Dark</span>
            </div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Accent Colors</h3>
            <div className="h-20 bg-accent rounded-md flex items-end p-2">
              <span className="text-white">Accent Default</span>
            </div>
            <div className="h-20 bg-accent-hover rounded-md flex items-end p-2">
              <span className="text-white">Accent Hover</span>
            </div>
            <div className="h-20 bg-accent-light rounded-md flex items-end p-2">
              <span className="text-gray-700">Accent Light</span>
            </div>
            <div className="h-20 bg-accent-dark rounded-md flex items-end p-2">
              <span className="text-white">Accent Dark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Colors */}
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4">Status Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 bg-destructive rounded-md flex items-end p-2">
            <span className="text-white">Destructive</span>
          </div>
          <div className="h-20 bg-warning rounded-md flex items-end p-2">
            <span className="text-white">Warning</span>
          </div>
          <div className="h-20 bg-success rounded-md flex items-end p-2">
            <span className="text-white">Success</span>
          </div>
        </div>
      </div>

      {/* Background and Border Colors */}
      <div>
        <h2 className="text-xl font-medium mb-4">System Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 bg-background border border-border rounded-md flex items-end p-2">
            <span className="text-gray-700">Background Color</span>
          </div>
          <div className="h-20 bg-card border border-border rounded-md flex items-end p-2">
            <span className="text-gray-700">Card Color</span>
          </div>
          <div className="h-20 bg-white border-4 border-ring rounded-md flex items-end p-2">
            <span className="text-gray-700">Ring Color (Border)</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-primary-dark font-bold leading-6 items-center">
        <h3>SHADCN </h3>`
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ColorSystemShowcase;
