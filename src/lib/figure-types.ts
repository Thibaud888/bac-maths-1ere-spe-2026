export type TreeNode = {
  label: string;
  weight?: string;
  children?: TreeNode[];
};

export type ImageFigure = {
  type: 'image';
  data: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  caption?: string;
};

export type TreeFigureData = {
  root: TreeNode;
  orientation?: 'horizontal' | 'vertical';
};

export type TreeFigure = {
  type: 'tree';
  data: TreeFigureData;
  caption?: string;
};

export type Figure = ImageFigure | TreeFigure;
