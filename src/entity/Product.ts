import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProductType} from './ProductType';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    name!: string;

    @ManyToOne(() => ProductType)
    productType!: ProductType;

    @Column({nullable: false})
    deleted!: boolean;
}
