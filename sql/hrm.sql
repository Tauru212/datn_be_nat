CREATE DATABASE IF NOT EXISTS `re_state` DEFAULT CHARACTER SET utf8 
COLLATE utf8_general_ci;

USE `re_state`;
CREATE TABLE IF NOT EXISTS `re_state`.`users` (
    `account_id` INT(20) NOT NULL AUTO_INCREMENT , 
    `email` VARCHAR(100) NOT NULL , 
    `password` VARCHAR(250) NOT NULL , 
    `role` ENUM('admin','user') NOT NULL DEFAULT 'user' , 
    `name` VARCHAR(100) NOT NULL , 
    `phone` VARCHAR(20) NULL DEFAULT NULL , 
    `address` VARCHAR(20) NULL DEFAULT NULL , 
    `avatar` VARCHAR(250) NULL DEFAULT NULL , 
    `birthday` VARCHAR(10) NULL DEFAULT NULL , 
    `gender` ENUM('male','female','not_disclosed') NULL DEFAULT NULL ,
    `create_at` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    PRIMARY KEY (`account_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `re_state`.`posts` (
    `post_id` INT(20) NOT NULL AUTO_INCREMENT ,
    `post_type` ENUM('sell', 'lease') NOT NULL DEFAULT 'sell', 
    `city_id` VARCHAR(100) NOT NULL , 
    `district_id` VARCHAR(250) NOT NULL , 
    `commune_id` VARCHAR(250) NOT NULL,
    `address` VARCHAR(250) NOT NULL,
    `re_state_type` ENUM('house', 'villa', 'apartment', 'bungalow') NOT NULL DEFAULT 'house', 
    `acreage` VARCHAR(20) NOT NULL,
    `price` VARCHAR(20) NOT NULL DEFAULT 0,

    `legal_documents` ENUM('owner_book', 'sales_contract', 'waiting_for_registration') DEFAULT NULL,
    `interior` ENUM('full', 'basic', 'nothing') DEFAULT NULL,
    `n_bedrooms` INT(4) DEFAULT NULL,
    `n_bathrooms` INT(4) DEFAULT NULL,
    `direction` VARCHAR(250) DEFAULT NULL,

    `account_id` INT(20) NOT NULL, 
    
    `contacts_name` VARCHAR(250) NOT NULL,
    `contacts_email` VARCHAR(250) DEFAULT NULL,
    `contacts_phone` VARCHAR(250) NOT NULL,

    `title` VARCHAR(1000) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,

    `status` ENUM('processing', 'approved', 'refuse', 'remove_post') NOT NULL DEFAULT 'processing',
    
    `state` ENUM('rented', 'advertisement') NOT NULL DEFAULT 'advertisement',
    -- `create_by_admin` INT DEFAULT 0, -- 0: create post by user, 1: create post by admin --
    
    `create_at` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `views` INT(20) DEFAULT 0,
    
    PRIMARY KEY (`post_id`),
    FOREIGN KEY (`account_id`) REFERENCES users(`account_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `re_state`.`post_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT(20),
    `image` VARCHAR(250),
    FOREIGN KEY (`post_id`) REFERENCES posts(`post_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `re_state`.`favorites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT(20),
    `account_id` INT(20),
    FOREIGN KEY (`post_id`) REFERENCES posts(`post_id`),
    FOREIGN KEY (`account_id`) REFERENCES users(`account_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `re_state`.`highlight_mark` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT(20),
    FOREIGN KEY (`post_id`) REFERENCES posts(`post_id`)
) ENGINE = InnoDB;

-- data example
-- users
INSERT INTO `users` (`email`, `password`, `role`, `name`) VALUES ('admin@restate.com', '$2a$10$HFYmFdz91XuUDm6vjSQYS.Vv0QtaNMA6o.ECRuDjoCWN2/hzQmN7K', 'admin', 'Admin Re-State');
INSERT INTO `users` (`account_id`, `email`, `password`, `role`, `name`, `phone`, `address`, `avatar`, `birthday`, `gender`, `create_at`) VALUES (NULL, 'kevil@gmail.com', '$2a$10$HFYmFdz91XuUDm6vjSQYS.Vv0QtaNMA6o.ECRuDjoCWN2/hzQmN7K', 'user', 'Lord Kevil', NULL, NULL, NULL, NULL, NULL, current_timestamp());

-- post
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '01', '001', '00001', 'Quận Tây Hồ', 'villa', '76', '15000000', NULL, NULL, NULL, NULL, NULL, '2', 'Lord Kevil', 'kevil@gmail.com', '09123123123', 'SIÊU HIẾM CHO THUÊ NHÀ MẶT TIỀN QUẬN TÂY HỒ, NGANG 5M, HẺM 8M, GẦN CHỢ & SÂN BANH TÂN SƠN, 140M²', 'Diện tích & Kết cấu: 140m² (5x28), nhà trệt, lửng, 2PN, phòng chức năng đầy đủ.\r\nVị trí: Hẻm rộng 8m, ô tô đỗ thoải mái, gần chợ, siêu thị Emart, sân golf Tân Sơn, kết nối đường Lạc Long Quân, Đống Đa.\r\nPháp lý: Sổ hồng chính chủ, công chứng ngay.\r\nLiên hệ: Phi Long (chủ gửi).', 'processing', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '01', '002', '00058', 'Phường Mai Dịch', 'apartment', '140', '18000000', 'owner_book', 'full', '3', '2', 'Hướng nhà Đông Nam', '2', 'Pham Van Hine', 'hine@gmail.com', '093123123', 'CHO THUÊ NHÀ MỚI ĐẸP 4PN - XE HƠI ĐỖ CỬA - GẦN MẶT TIỀN.', 'CHO THUÊ NHÀ MỚI ĐẸP 4PN - XE HƠI ĐỖ CỬA - GẦN MẶT TIỀN r\n\r\nĐịa chỉ: Phạm Văn Chiêu, Quận Thanh Trì', 'processing', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', '112 Hàng Buồm', 'villa', '45', '21000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'Cho thuê nhà đẹp đỉnh cấp', 'Thuê nhà này khỏi cần chê, vì nó quá đẹp. Xem ngay nhé', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '79', '760', '26734', 'S203 Vinhome Smart City', 'apartment', '120', '10000000', NULL, NULL, NULL, NULL, NULL, '2', 'Ngô Khánh Huyền', NULL, '0912030203', 'Cho thuê căn hộ Vinhomes Smart City giá tốt nhất (1-2-3-4 PN đầy đủ các loại diện tích)', 'Dự án S203 Vinhome Smart City, Đường Tây Mỗ, Hà Nội', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', 'Mậu Lương, Hà Đông', 'house', '45', '12000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'CHO THUÊ NHÀ NGUYÊN CĂN TẠI MẬU LƯƠNG HÀ ĐÔNG', 'Nhà cạnh toà fivestart khương đình 5 tầng \r\n T1 : khách, bếp, chỗ để xe \r\n T2,3,4: Mỗi tầng 1 phòng 1 ngủ 1 wc \r\n T5: sân phơi \r\n Full đồ, nhà mới sơn sửa lại \r\n Phù hợp với khách ra đình, nhóm sv ít người', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', 'Hồ Văn Chương, Đống Đa', 'apartment', '45', '12000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'CHO THUÊ NHÀ TẠI NGAY MẶT HỒ VĂN CHƯƠNG - ĐỐNG ĐA', 'Thiết kế: \r\n- 1 phòng ngủ - diện tích 60m2 - Trang bị đầy đủ: Điều hoà , nóng lạnh , giường tủ , chăn ga gối đệm , tủ lạnh , máy giặt … xách vali đến là ở \r\n🌹Giờ giấc tự do, thoải mái, nội thất sang trọng , có thang máy \r\n🌹Giao thông thuận tiện \r\nTình trạng:  \r\n✍️Đã trống', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '79', '760', '26734', 'Núi Đồng Đò, Sóc Sơn', 'bungalow', '120', '10000000', NULL, NULL, NULL, NULL, NULL, '2', 'Ngô Khánh Huyền', NULL, '0912030203', 'CHO THUÊ HOA HỒNG VILLA 2PN SÓC SƠN', 'Thiết kế pha trộn phong cách châu âu và nhật bản rất lạ, nằm ở sườn núi Đồng Đò bốn phía view rừng núi, cực kì gần trời có thể ngắm trăng sao 💫\r\n 🏠Địa chỉ: Núi Đồng Đò, Sóc Sơn, Hà Nội (cách mặt hồ 2km) \r\n 📍Thông tin căn: \r\n 🍃Tầng 1: \r\n - Phòng khách thông tầng, có TV 55 in 📺 \r\n - Phòng bếp có tủ lạnh, đầy đủ dụng cụ nấu nướng, lò vi sóng, nồi chiên không dầu 🥂\r\n 🍃Tầng 2: \r\n - 2 phòng ngủ khép kín, trong đó:\r\n  + 1 phòng ngủ 1 giường\r\n  + 1 phòng ngủ 2 giường (phòng có thể kê thêm 5-6 đệm) \r\n - nhà vệ sinh có bồn tắm siêu chill 🛁 ', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', 'Ba Vì', 'bungalow', '45', '36000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'Vườn Vua Resort & Thủy - Ba Vì', '📌Trọn gói [ phòng nghỉ + ăn uống ]\r\n ⚡️ Trải nghiệm nghỉ dưỡng tại BT Bích Liên \r\n ⚡️ Bữa sáng buffet tại Vườn Vua Resort\r\n ⚡️ Bữa tối theo set menu tại nhà hàng trong Resort \r\n ⚡️ Free sử dụng mọi tiện ích nơi nghỉ dưỡng : Bể bơi, phòng Gym, Công viên khoáng nóng núi đá Onsen, Xe đạp đơn…\r\n ⚡️ Miễn phí 01 trẻ em dưới 6 tuổi ', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', '99 Tân Triều', 'arpartment', '45', '5000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'Cho thuê chung cư mới xây', 'Thuê chung cư này khỏi cần chê, vì nó quá đẹp. Xem ngay nhé', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', '460 Khương Đình', 'house ', '45', '7000000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'Cho thuê nhà 460 khương đình - ngõ rộng nhất khương đình', 'Nhà cạnh toà fivestart khương đình 5 tầng\r\nT1 : khách, bếp, chỗ để xe\r\nT2,3,4: Mỗi tầng 1 phòng 1 ngủ 1 wc\r\n T5: sân phơi\r\n Full đồ, nhà mới sơn sửa lạ', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '79', '760', '26734', 'S203 Vinhome Smart City', 'apartment', '120', '10000000', NULL, NULL, NULL, NULL, NULL, '2', 'Ngô Khánh Huyền', NULL, '0912030203', 'Cho thuê căn hộ Vinhomes Smart City giá tốt nhất (1-2-3-4 PN đầy đủ các loại diện tích)', 'Dự án S203 Vinhome Smart City, Đường Tây Mỗ, Hà Nội', 'approved', current_timestamp(), '0');
INSERT INTO `posts` (`post_id`, `post_type`, `city_id`, `district_id`, `commune_id`, `address`, `re_state_type`, `acreage`, `price`, `legal_documents`, `interior`, `n_bedrooms`, `n_bathrooms`, `direction`, `account_id`, `contacts_name`, `contacts_email`, `contacts_phone`, `title`, `description`, `status`, `create_at`, `views`) VALUES (NULL, 'lease', '36', '356', '13633', '1 Đặng Văn Ngữ', 'house', '45', '5500000', NULL, NULL, NULL, NULL, NULL, '2', 'Kevil', 'kevil@gmail.com', '0231231232', 'Cho thuê mặt bằng kinh doanh Đặng Văn Ngữ', '_ Mặt bằng tầng 1: 1 sân để xe + 1 khuôn viên hồ cá – trong nhà 2 gian\r\n _ Diện tích: tổng 135m²\r\n _ Mặt tiền: 11,2m\r\n _ Ngõ vào thông 3 trục chính: Phạm Ngọc Thạch, Hồ Đắc Di, Xã Đàn\r\n _ Khu vực trung tâm: các tiện ích đều đủ trong bán kính 1km', 'approved', current_timestamp(), '0');


-- post_images
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '1', '001.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '1', '002.png');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '1', '003.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '1', '004.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '2', '005.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '2', '006.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '2', '007.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '3', '007.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '3', '008.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '3', '009.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '3', '010.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '4', '011.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '4', '012.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '4', '013.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '016.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '017.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '018.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '019.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '020.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '5', '021.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '6', '022.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '6', '023.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '6', '024.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '6', '025.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '026.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '027.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '028.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '029.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '030.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '031.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '032.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '7', '033.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '8', '034.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '8', '035.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '8', '036.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '8', '037.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '9', '038.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '9', '039.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '9', '040.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '9', '041.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '042.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '043.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '044.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '045.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '046.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '10', '047.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '11', '048.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '11', '049.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '11', '050.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '11', '051.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '11', '052.jpg');

INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '12', '053.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '12', '054.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '12', '055.jpg');
INSERT INTO `post_images` (`id`, `post_id`, `image`) VALUES (NULL, '12', '056.jpg');


-- favorites
INSERT INTO `favorites` (`id`, `post_id`, `account_id`) VALUES (NULL, '1', '2');