BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] INT NOT NULL CONSTRAINT [Users_role_df] DEFAULT 0,
    [avatar] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Users_phone_key] UNIQUE NONCLUSTERED ([phone])
);

-- CreateTable
CREATE TABLE [dbo].[Brands] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Brands_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Brands_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Brands_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Categories] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Categories_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Categories_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Categories_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [price] INT NOT NULL CONSTRAINT [Products_price_df] DEFAULT 0,
    [oldPrice] INT,
    [image] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [specification] NVARCHAR(1000),
    [buyTurn] INT NOT NULL CONSTRAINT [Products_buyTurn_df] DEFAULT 0,
    [quantity] INT NOT NULL CONSTRAINT [Products_quantity_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Products_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [brandId] INT NOT NULL,
    [categoryId] INT NOT NULL,
    CONSTRAINT [Products_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] INT NOT NULL CONSTRAINT [Orders_status_df] DEFAULT 0,
    [note] NVARCHAR(1000),
    [total] INT NOT NULL CONSTRAINT [Orders_total_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Orders_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [userId] INT,
    CONSTRAINT [Orders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [price] INT NOT NULL,
    [quantity] INT NOT NULL CONSTRAINT [OrderDetails_quantity_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OrderDetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [orderId] INT NOT NULL,
    [productId] INT,
    CONSTRAINT [OrderDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Feedbacks] (
    [id] INT NOT NULL IDENTITY(1,1),
    [star] INT NOT NULL CONSTRAINT [Feedbacks_star_df] DEFAULT 5,
    [content] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Feedbacks_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [userId] INT NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [Feedbacks_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[News] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [News_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [News_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NewsDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [NewsDetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [newsId] INT NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [NewsDetails_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [NewsDetails_newsId_productId_key] UNIQUE NONCLUSTERED ([newsId],[productId])
);

-- CreateTable
CREATE TABLE [dbo].[Banners] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [Banners_status_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Banners_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Banners_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BannerDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BannerDetails_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    [bannerId] INT NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [BannerDetails_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BannerDetails_bannerId_productId_key] UNIQUE NONCLUSTERED ([bannerId],[productId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [Products_brandId_fkey] FOREIGN KEY ([brandId]) REFERENCES [dbo].[Brands]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [Products_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Categories]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetails] ADD CONSTRAINT [OrderDetails_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Orders]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderDetails] ADD CONSTRAINT [OrderDetails_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Feedbacks] ADD CONSTRAINT [Feedbacks_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Feedbacks] ADD CONSTRAINT [Feedbacks_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NewsDetails] ADD CONSTRAINT [NewsDetails_newsId_fkey] FOREIGN KEY ([newsId]) REFERENCES [dbo].[News]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NewsDetails] ADD CONSTRAINT [NewsDetails_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BannerDetails] ADD CONSTRAINT [BannerDetails_bannerId_fkey] FOREIGN KEY ([bannerId]) REFERENCES [dbo].[Banners]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BannerDetails] ADD CONSTRAINT [BannerDetails_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
