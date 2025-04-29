/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     4/29/2025 11:57:16 PM                        */
/*==============================================================*/


alter table CART 
   drop foreign key FK_CART_ASSOCIATI_PRODUCTS;

alter table CART 
   drop foreign key FK_CART_ASSOCIATI_USERS;

alter table INVENTORY 
   drop foreign key FK_INVENTOR_ASSOCIATI_MATERIAL;

alter table MATERIALS 
   drop foreign key FK_MATERIAL_ASSOCIATI_MATERIAL;

alter table MATERIAL_ORDERS 
   drop foreign key FK_MATERIAL_ASSOCIATI_SUPPLIER;

alter table MATERIAL_ORDERS 
   drop foreign key FK_MATERIAL_ASSOCIATI_MATERIAL;

alter table ORDERS 
   drop foreign key FK_ORDERS_ASSOCIATI_USERS;

alter table ORDER_ITEMS 
   drop foreign key FK_ORDER_IT_ASSOCIATI_ORDERS;

alter table ORDER_ITEMS 
   drop foreign key FK_ORDER_IT_ASSOCIATI_PRODUCTS;

alter table PRODUCTION_MATERIALS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_MATERIAL;

alter table PRODUCTION_MATERIALS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTI;

alter table PRODUCTION_PLANS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_USERS;

alter table PRODUCTION_PLANS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTS;

alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_USERS;

alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_EQUIPMEN;

alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTI;

alter table PRODUCTS 
   drop foreign key FK_PRODUCTS_ASSOCIATI_CATEGORI;

alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_USERS;

alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_PRODUCTS;

alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_PRODUCTI;

alter table USERS 
   drop foreign key FK_USERS_ASSOCIATI_ROLE;


alter table CART 
   drop foreign key FK_CART_ASSOCIATI_USERS;

alter table CART 
   drop foreign key FK_CART_ASSOCIATI_PRODUCTS;

drop table if exists CART;

drop table if exists CATEGORIES;

drop table if exists EQUIPMENT;


alter table INVENTORY 
   drop foreign key FK_INVENTOR_ASSOCIATI_MATERIAL;

drop table if exists INVENTORY;


alter table MATERIALS 
   drop foreign key FK_MATERIAL_ASSOCIATI_MATERIAL;

drop table if exists MATERIALS;


alter table MATERIAL_ORDERS 
   drop foreign key FK_MATERIAL_ASSOCIATI_SUPPLIER;

alter table MATERIAL_ORDERS 
   drop foreign key FK_MATERIAL_ASSOCIATI_MATERIAL;

drop table if exists MATERIAL_ORDERS;

drop table if exists MATERIAL_TYPES;


alter table ORDERS 
   drop foreign key FK_ORDERS_ASSOCIATI_USERS;

drop table if exists ORDERS;


alter table ORDER_ITEMS 
   drop foreign key FK_ORDER_IT_ASSOCIATI_ORDERS;

alter table ORDER_ITEMS 
   drop foreign key FK_ORDER_IT_ASSOCIATI_PRODUCTS;

drop table if exists ORDER_ITEMS;


alter table PRODUCTION_MATERIALS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_MATERIAL;

alter table PRODUCTION_MATERIALS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTI;

drop table if exists PRODUCTION_MATERIALS;


alter table PRODUCTION_PLANS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTS;

alter table PRODUCTION_PLANS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_USERS;

drop table if exists PRODUCTION_PLANS;


alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_PRODUCTI;

alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_USERS;

alter table PRODUCTION_STEPS 
   drop foreign key FK_PRODUCTI_ASSOCIATI_EQUIPMEN;

drop table if exists PRODUCTION_STEPS;


alter table PRODUCTS 
   drop foreign key FK_PRODUCTS_ASSOCIATI_CATEGORI;

drop table if exists PRODUCTS;


alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_USERS;

alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_PRODUCTS;

alter table QUALITY_CONTROL 
   drop foreign key FK_QUALITY__ASSOCIATI_PRODUCTI;

drop table if exists QUALITY_CONTROL;

drop table if exists ROLE;

drop table if exists SUPPLIERS;


alter table USERS 
   drop foreign key FK_USERS_ASSOCIATI_ROLE;

drop table if exists USERS;

/*==============================================================*/
/* Table: CART                                                  */
/*==============================================================*/
create table CART
(
   ID_CART              int not null  comment '',
   ID_PRODUCT           int not null  comment '',
   ID_USERS             int not null  comment '',
   CREATED_AT_CART      datetime  comment '',
   primary key (ID_CART)
);

/*==============================================================*/
/* Table: CATEGORIES                                            */
/*==============================================================*/
create table CATEGORIES
(
   ID_CATEGORIES_       int not null  comment '',
   NAME_CATEGORIES_     varchar(255)  comment '',
   primary key (ID_CATEGORIES_)
);

/*==============================================================*/
/* Table: EQUIPMENT                                             */
/*==============================================================*/
create table EQUIPMENT
(
   ID_EQUIPMENT         int not null  comment '',
   NAME_EQUIPMENT       varchar(255)  comment '',
   TYPE_EQUIPMENT       varchar(255)  comment '',
   STATUS               varchar(255)  comment '',
   LAST_MAINTENANCE     varchar(255)  comment '',
   CREATED_AT           datetime  comment '',
   UPDATED_AT           datetime  comment '',
   primary key (ID_EQUIPMENT)
);

/*==============================================================*/
/* Table: INVENTORY                                             */
/*==============================================================*/
create table INVENTORY
(
   ID_INVENTORY_        int not null  comment '',
   ID_MATERIALS_        int not null  comment '',
   QUANTITY_INVENTORY   int  comment '',
   LAST_UPDATED_        datetime  comment '',
   STORAGE_CONDITION    varchar(255)  comment '',
   primary key (ID_INVENTORY_)
);

/*==============================================================*/
/* Table: MATERIALS                                             */
/*==============================================================*/
create table MATERIALS
(
   ID_MATERIALS_        int not null  comment '',
   ID_MATERIAL_TYPES    int not null  comment '',
   NAME_                varchar(255)  comment '',
   UNIT_                varchar(255)  comment '',
   COST_PER_UNIT_       float  comment '',
   CREATED_AT_PRODUCTS  datetime  comment '',
   UPDATED_AT_PRODUCTS  datetime  comment '',
   ORIGIN               varchar(255)  comment '',
   EXPIRY_DATE          datetime  comment '',
   primary key (ID_MATERIALS_)
);

/*==============================================================*/
/* Table: MATERIAL_ORDERS                                       */
/*==============================================================*/
create table MATERIAL_ORDERS
(
   ID_MATERIALS_        int not null  comment '',
   ID_SUPPLIERS         int not null  comment '',
   ID_MATERIAL_ORDER    int  comment '',
   QUANTITY_ORDERED     int  comment '',
   ORDER_DATE           datetime  comment '',
   DELIVERY_DATE        datetime  comment '',
   STATUS               varchar(255)  comment '',
   TOTAL_COST           float  comment ''
);

/*==============================================================*/
/* Table: MATERIAL_TYPES                                        */
/*==============================================================*/
create table MATERIAL_TYPES
(
   ID_MATERIAL_TYPES    int not null  comment '',
   NAME_MATERIAL_TYPES  varchar(255)  comment '',
   primary key (ID_MATERIAL_TYPES)
);

/*==============================================================*/
/* Table: ORDERS                                                */
/*==============================================================*/
create table ORDERS
(
   ID_ORDERS_           int not null  comment '',
   ID_USERS             int not null  comment '',
   DATE_ORDER           datetime  comment '',
   TOTAL_AMOUNT_ORDER   float  comment '',
   PAYMENT_STATUS_ORDER varchar(255)  comment '',
   SHIPPING_STATUS_ORDER varchar(255)  comment '',
   SHIPPING_ADDRESS     varchar(255)  comment '',
   SHIPPING_METHOD      varchar(255)  comment '',
   SHIPPING_COST        varchar(255)  comment '',
   primary key (ID_ORDERS_)
);

/*==============================================================*/
/* Table: ORDER_ITEMS                                           */
/*==============================================================*/
create table ORDER_ITEMS
(
   ID_ORDER_ITEMS       int not null  comment '',
   ID_PRODUCT           int not null  comment '',
   ID_ORDERS_           int not null  comment '',
   QUANTITY_INVENTORY   int  comment '',
   PRICE_ORDER_ITEMS    float  comment '',
   primary key (ID_ORDER_ITEMS)
);

/*==============================================================*/
/* Table: PRODUCTION_MATERIALS                                  */
/*==============================================================*/
create table PRODUCTION_MATERIALS
(
   ID_PRODUCT_MATERIALS int not null  comment '',
   ID_PRODUCTION_PLANS  int not null  comment '',
   ID_MATERIALS_        int not null  comment '',
   QUANTITY_PER_UNIT_PRODUCT_MATERIALS float  comment '',
   UNIT_PRODUCT_MATERIALS varchar(255)  comment '',
   primary key (ID_PRODUCT_MATERIALS)
);

/*==============================================================*/
/* Table: PRODUCTION_PLANS                                      */
/*==============================================================*/
create table PRODUCTION_PLANS
(
   ID_PRODUCTION_PLANS  int not null  comment '',
   ID_PRODUCT           int not null  comment '',
   ID_USERS             int not null  comment '',
   PLANNED_START_PRODUCTION_PLANS datetime  comment '',
   PLANNED_END_PRODUCTION_PLANS datetime  comment '',
   ACTUAL_START_PRODUCTION_PLANS datetime  comment '',
   ACTUAL_END_PRODUCTION_PLANS datetime  comment '',
   STATUS_PRODUCTION_PLANS varchar(255)  comment '',
   NOTE_PRODUCTION_PLANS text  comment '',
   primary key (ID_PRODUCTION_PLANS)
);

/*==============================================================*/
/* Table: PRODUCTION_STEPS                                      */
/*==============================================================*/
create table PRODUCTION_STEPS
(
   ID_PRODUCTION_STEPS_ int not null  comment '',
   ID_PRODUCTION_PLANS  int not null  comment '',
   ID_USERS             int not null  comment '',
   ID_EQUIPMENT         int not null  comment '',
   STEP_NAME_PRODUCTION_STEPS varchar(255)  comment '',
   START_TIME_PRODUCTION_STEPS datetime  comment '',
   END_TIME_PRODUCTION_STEPS datetime  comment '',
   STATUS_PRODUCTION_STEPS varchar(255)  comment '',
   primary key (ID_PRODUCTION_STEPS_)
);

/*==============================================================*/
/* Table: PRODUCTS                                              */
/*==============================================================*/
create table PRODUCTS
(
   ID_PRODUCT           int not null  comment '',
   ID_CATEGORIES_       int not null  comment '',
   NAME_PRODUCTS        varchar(255)  comment '',
   DESCRIPTION_PRODUCTS varchar(255)  comment '',
   PRICE_PRODUCTS       float  comment '',
   STOCK_PRODUCTS       int  comment '',
   IMAGE_URL_PRODUCTS   varchar(255)  comment '',
   CREATED_AT_PRODUCTS  datetime  comment '',
   UPDATED_AT_PRODUCTS  datetime  comment '',
   primary key (ID_PRODUCT)
);

/*==============================================================*/
/* Table: QUALITY_CONTROL                                       */
/*==============================================================*/
create table QUALITY_CONTROL
(
   ID_QUALITY_CONTROL   int not null  comment '',
   ID_PRODUCTION_STEPS_ int not null  comment '',
   ID_PRODUCT           int not null  comment '',
   ID_USERS             int not null  comment '',
   CHECK_DATE           datetime  comment '',
   RESULT               varchar(255)  comment '',
   NOTE                 text  comment '',
   primary key (ID_QUALITY_CONTROL)
);

/*==============================================================*/
/* Table: ROLE                                                  */
/*==============================================================*/
create table ROLE
(
   ID_ROLE              int not null  comment '',
   NAME_ROLE            varchar(255)  comment '',
   LIST_PERMISION       varchar(255)  comment '',
   IS_DELETE            bool  comment '',
   CODE_NAME            varchar(255)  comment '',
   primary key (ID_ROLE)
);

/*==============================================================*/
/* Table: SUPPLIERS                                             */
/*==============================================================*/
create table SUPPLIERS
(
   ID_SUPPLIERS         int not null  comment '',
   NAME_PRODUCTS        varchar(255)  comment '',
   ADDRESS_SUPPLIERS    varchar(255)  comment '',
   PHONE_SUPPLIERS      int  comment '',
   EMAIL_SUPPLIERS      varchar(255)  comment '',
   CREATED_AT_SUPPLIERS datetime  comment '',
   UPDATED_AT_SUPPLIERS datetime  comment '',
   STATUS_SUPPLIERS     varchar(255)  comment '',
   primary key (ID_SUPPLIERS)
);

/*==============================================================*/
/* Table: USERS                                                 */
/*==============================================================*/
create table USERS
(
   ID_USERS             int not null  comment '',
   ID_ROLE              int not null  comment '',
   NAME_USERS           varchar(255)  comment '',
   EMAIL_USERS          varchar(255)  comment '',
   _PASSWORD_HASH_USERS varchar(255)  comment '',
   PHONE_USERS          int  comment '',
   IS_ACTIVE_USERS      varchar(255)  comment '',
   CREATED_AT_USERS     datetime  comment '',
   UPDATED_AT_USERS     datetime  comment '',
   IS_DELETE_USERS      varchar(255)  comment '',
   primary key (ID_USERS)
);

alter table CART add constraint FK_CART_ASSOCIATI_PRODUCTS foreign key (ID_PRODUCT)
      references PRODUCTS (ID_PRODUCT) on delete restrict on update restrict;

alter table CART add constraint FK_CART_ASSOCIATI_USERS foreign key (ID_USERS)
      references USERS (ID_USERS) on delete restrict on update restrict;

alter table INVENTORY add constraint FK_INVENTOR_ASSOCIATI_MATERIAL foreign key (ID_MATERIALS_)
      references MATERIALS (ID_MATERIALS_) on delete restrict on update restrict;

alter table MATERIALS add constraint FK_MATERIAL_ASSOCIATI_MATERIAL foreign key (ID_MATERIAL_TYPES)
      references MATERIAL_TYPES (ID_MATERIAL_TYPES) on delete restrict on update restrict;

alter table MATERIAL_ORDERS add constraint FK_MATERIAL_ASSOCIATI_SUPPLIER foreign key (ID_SUPPLIERS)
      references SUPPLIERS (ID_SUPPLIERS) on delete restrict on update restrict;

alter table MATERIAL_ORDERS add constraint FK_MATERIAL_ASSOCIATI_MATERIAL foreign key (ID_MATERIALS_)
      references MATERIALS (ID_MATERIALS_) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_ASSOCIATI_USERS foreign key (ID_USERS)
      references USERS (ID_USERS) on delete restrict on update restrict;

alter table ORDER_ITEMS add constraint FK_ORDER_IT_ASSOCIATI_ORDERS foreign key (ID_ORDERS_)
      references ORDERS (ID_ORDERS_) on delete restrict on update restrict;

alter table ORDER_ITEMS add constraint FK_ORDER_IT_ASSOCIATI_PRODUCTS foreign key (ID_PRODUCT)
      references PRODUCTS (ID_PRODUCT) on delete restrict on update restrict;

alter table PRODUCTION_MATERIALS add constraint FK_PRODUCTI_ASSOCIATI_MATERIAL foreign key (ID_MATERIALS_)
      references MATERIALS (ID_MATERIALS_) on delete restrict on update restrict;

alter table PRODUCTION_MATERIALS add constraint FK_PRODUCTI_ASSOCIATI_PRODUCTI foreign key (ID_PRODUCTION_PLANS)
      references PRODUCTION_PLANS (ID_PRODUCTION_PLANS) on delete restrict on update restrict;

alter table PRODUCTION_PLANS add constraint FK_PRODUCTI_ASSOCIATI_USERS foreign key (ID_USERS)
      references USERS (ID_USERS) on delete restrict on update restrict;

alter table PRODUCTION_PLANS add constraint FK_PRODUCTI_ASSOCIATI_PRODUCTS foreign key (ID_PRODUCT)
      references PRODUCTS (ID_PRODUCT) on delete restrict on update restrict;

alter table PRODUCTION_STEPS add constraint FK_PRODUCTI_ASSOCIATI_USERS foreign key (ID_USERS)
      references USERS (ID_USERS) on delete restrict on update restrict;

alter table PRODUCTION_STEPS add constraint FK_PRODUCTI_ASSOCIATI_EQUIPMEN foreign key (ID_EQUIPMENT)
      references EQUIPMENT (ID_EQUIPMENT) on delete restrict on update restrict;

alter table PRODUCTION_STEPS add constraint FK_PRODUCTI_ASSOCIATI_PRODUCTI foreign key (ID_PRODUCTION_PLANS)
      references PRODUCTION_PLANS (ID_PRODUCTION_PLANS) on delete restrict on update restrict;

alter table PRODUCTS add constraint FK_PRODUCTS_ASSOCIATI_CATEGORI foreign key (ID_CATEGORIES_)
      references CATEGORIES (ID_CATEGORIES_) on delete restrict on update restrict;

alter table QUALITY_CONTROL add constraint FK_QUALITY__ASSOCIATI_USERS foreign key (ID_USERS)
      references USERS (ID_USERS) on delete restrict on update restrict;

alter table QUALITY_CONTROL add constraint FK_QUALITY__ASSOCIATI_PRODUCTS foreign key (ID_PRODUCT)
      references PRODUCTS (ID_PRODUCT) on delete restrict on update restrict;

alter table QUALITY_CONTROL add constraint FK_QUALITY__ASSOCIATI_PRODUCTI foreign key (ID_PRODUCTION_STEPS_)
      references PRODUCTION_STEPS (ID_PRODUCTION_STEPS_) on delete restrict on update restrict;

alter table USERS add constraint FK_USERS_ASSOCIATI_ROLE foreign key (ID_ROLE)
      references ROLE (ID_ROLE) on delete restrict on update restrict;

