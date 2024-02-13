import {DataSource, DataSourceOptions, FindManyOptions} from 'typeorm'
import {ProductType} from './entity/ProductType';
import {Product} from './entity/Product';

class Service {
    async run() {
        const options: DataSourceOptions = {
            type: 'sqlite',
            database: ':memory:',
            entities: [ProductType, Product],
            synchronize: true,
            logging: true,
            migrations: [],
        }

        const dataSource = new DataSource(options)
        await dataSource.initialize()

        const ProductRepo = dataSource.getRepository(Product)
        const typeRepo = dataSource.getRepository(ProductType)

        ///
        /// PREPARE SOME DATA
        ///
        const carType = new ProductType()
        const shoeType = new ProductType()
        carType.type = 'car'
        shoeType.type = 'shoe'
        await typeRepo.save(carType)
        await typeRepo.save(shoeType)


        for (let i = 0; i < 5; i++) {
            const product = new Product()
            product.productType = new ProductType()
            product.productType.id = i % 2 === 0 ? carType.id : shoeType.id
            product.name = `Product ${i}`
            product.deleted = false
            await ProductRepo.save(product)
        }




        ///
        /// Build query which will throw an error
        ///
        const findManyOptions: FindManyOptions<Product> = {
            relations: {productType: true},  // Relations, in combination with order, is throwing an SQLite error.
            select: ['id'],
            take: 1,
            where: [{deleted: false}],
            order: {
                // when you delete this line, or the relations line, the query will work.
                name: 'desc',

                // when sorting on id instead, the query will work because it's selected in the `select`
                // id: 'desc'
            }
        }

        const products = await ProductRepo.find(findManyOptions);
        console.log() // print empty line so we can see the result easier in the console, seperated from the query debug output
        console.log(products)
    }
}

const service = new Service()
service.run()
    .catch(console.error)
