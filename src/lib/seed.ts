import dbConnect from './db';
import CategoryModel from '../models/CategoryModel';
import ListingModel from '../models/ListingModel';
import { IAttributeSchema } from '@/types';

const seedData = async () => {
  await dbConnect();

  await CategoryModel.deleteMany({});
  await ListingModel.deleteMany({});

  console.log('Cleared old data.');

  const tvAttributeSchema: IAttributeSchema[] = [
    { name: 'Brand', attributeKey: 'brand', type: 'checkbox' },
    { name: 'Screen Size (Inches)', attributeKey: 'screenSize', type: 'checkbox' },
    { name: 'Resolution', attributeKey: 'resolution', type: 'dropdown' },
  ];

  const shoeAttributeSchema: IAttributeSchema[] = [
    { name: 'Brand', attributeKey: 'brand', type: 'checkbox' },
    { name: 'Size (US)', attributeKey: 'size', type: 'checkbox' },
    { name: 'Color', attributeKey: 'color', type: 'checkbox' },
    { name: 'Gender', attributeKey: 'gender', type: 'dropdown' },
  ];

  const categories = [
    { name: 'Televisions', slug: 'televisions', attributeSchema: tvAttributeSchema },
    { name: 'Running Shoes', slug: 'running-shoes', attributeSchema: shoeAttributeSchema },
  ];

  const createdCategories = await CategoryModel.insertMany(categories);
  console.log('Categories seeded.');

  const tvCategory = createdCategories.find(c => c.slug === 'televisions')!;
  const shoeCategory = createdCategories.find(c => c.slug === 'running-shoes')!;

  const listings = [];

  const tvBrands = ['Samsung', 'LG', 'Sony', 'TCL'];
  const tvSizes = ['43', '50', '55', '65', '75'];
  const tvResolutions = ['HD', 'Full HD', '4K UHD', '8K UHD'];

  for (let i = 0; i < 20; i++) {
    const brand = tvBrands[i % tvBrands.length];
    listings.push({
      title: `${brand} ${tvSizes[i % tvSizes.length]}" Smart QLED TV Series ${i + 3}`,
      description: `Experience stunning visuals with this ${tvResolutions[i % tvResolutions.length]} TV. Perfect for movies and gaming.`,
      price: Math.floor(Math.random() * 1500) + 300,
      location: ['New York', 'London', 'Mumbai', 'Tokyo'][i % 4],
      category: tvCategory._id,
      attributes: {
        brand: brand,
        screenSize: tvSizes[i % tvSizes.length],
        resolution: tvResolutions[i % tvResolutions.length],
        smartFeatures: (i % 2 === 0) ? 'Yes' : 'No',
      },
    });
  }

  const shoeBrands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Asics'];
  const shoeSizes = ['7', '8', '9', '10', '11', '12'];
  const shoeColors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Grey'];
  const shoeGenders = ["Men's", "Women's", "Unisex"];

  for (let i = 0; i < 20; i++) {
     const brand = shoeBrands[i % shoeBrands.length];
    listings.push({
      title: `${brand} ${shoeGenders[i % shoeGenders.length]} Runner X${i + 100}`,
      description: `Comfortable and stylish ${shoeColors[i % shoeColors.length]} running shoes, size ${shoeSizes[i % shoeSizes.length]}.`,
      price: Math.floor(Math.random() * 100) + 50,
      location: ['Online', 'Retail Store A', 'Retail Store B'][i % 3],
      category: shoeCategory._id,
      attributes: {
        brand: brand,
        size: shoeSizes[i % shoeSizes.length],
        color: shoeColors[i % shoeColors.length],
        gender: shoeGenders[i % shoeGenders.length],
        material: (i % 2 === 0) ? 'Mesh' : 'Synthetic',
      },
    });
  }

  await ListingModel.insertMany(listings);
  console.log('Listings seeded.');

  process.exit(0);
};

seedData().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});