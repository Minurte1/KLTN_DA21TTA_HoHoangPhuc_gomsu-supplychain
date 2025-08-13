import React from "react";
import "./scss/ceramic.scss";
import ceramic2 from "../../public/images/ceramic/ceramic2.jpg";
import ceramic3 from "../../public/images/ceramic/ceramic3.jpg";

const CeramicLanding = () => {
  return (
    <div className="ceramic-landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Văn Hóa Gốm Sứ Việt Nam</h1>
          <p>
            Hãy cùng chúng tôi bước vào thế giới gốm sứ, nơi mà mỗi sản phẩm đều
            chứa đựng một câu chuyện nghìn năm, từ những ngôi làng yên bình đến
            những bàn tay tài hoa của các nghệ nhân.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="history">
        <h2>Nguồn Gốc & Sự Ra Đời</h2>
        <div className="history-content">
          <div className="text">
            <p>
              Nghề gốm sứ ở Việt Nam là một trong những nghề thủ công lâu đời,
              gắn liền với đời sống tinh thần và vật chất của người Việt từ hàng
              ngàn năm trước. Nguồn gốc của nghề gốm có thể truy về thời kỳ đồ
              đá mới, khi con người biết sử dụng đất sét để tạo ra các vật dụng
              sinh hoạt, từ bình đựng nước, bát, nồi đến các đồ trang trí nhỏ.
              Những vùng đất ven sông như sông Hồng, sông Cả, sông Đồng Nai, với
              lớp đất đỏ và đất sét dẻo, chính là nguyên liệu thiên nhiên quý
              giá, cung cấp chất lượng đất sét tốt nhất cho việc tạo hình và
              nung gốm.
            </p>
            <p>
              Qua thời gian, gốm sứ Việt Nam không chỉ dừng lại ở chức năng sinh
              hoạt mà còn trở thành biểu tượng văn hóa, tín ngưỡng và nghệ
              thuật. Các dòng gốm nổi tiếng như Bát Tràng, Chu Đậu, Phù Lãng,
              Lái Thiêu đều mang những đặc trưng riêng: men trắng tinh khiết,
              men xanh lam, men rạn cổ kính, hay các họa tiết chạm trổ tinh xảo.
              Mỗi sản phẩm gốm đều phản ánh nét văn hóa đặc trưng của vùng miền,
              sự sáng tạo và gu thẩm mỹ của người Việt.
            </p>
            <p>
              Trong văn hóa Việt, gốm sứ còn đóng vai trò quan trọng trong đời
              sống tâm linh và tín ngưỡng. Trong các đền chùa, cung điện, mộ
              táng, gốm sứ được sử dụng không chỉ để trang trí mà còn để thể
              hiện quyền lực, địa vị xã hội và niềm tin tâm linh. Họa tiết rồng,
              phượng, hoa sen hay trống đồng không chỉ là trang trí mà còn mang
              ý nghĩa phong thủy: rồng biểu tượng cho quyền lực và sự thịnh
              vượng, phượng tượng trưng cho vẻ đẹp, uy quyền và may mắn, hoa sen
              gắn với sự thanh khiết, bình an và trí tuệ.
            </p>
            <p>
              Kỹ thuật làm gốm của Việt Nam cũng đặc sắc và đa dạng. Từ việc lựa
              chọn đất, tạo hình bằng tay hoặc trên bàn xoay, đến việc trang trí
              họa tiết và nung trong lò củi hay lò hiện đại, mỗi công đoạn đều
              đòi hỏi sự kiên nhẫn, khéo léo và tinh thần sáng tạo. Nghệ nhân
              gốm phải am hiểu chất đất, cách phối trộn men, điều chỉnh nhiệt độ
              lò nung để tạo ra sản phẩm vừa đẹp mắt vừa bền chắc.
            </p>
            {/* <p>
              Ngày nay, gốm sứ Việt Nam không chỉ phục vụ nhu cầu trong nước mà
              còn được xuất khẩu ra nhiều quốc gia, xuất hiện trong các triển
              lãm quốc tế và các bộ sưu tập nghệ thuật. Những chiếc bình, tượng
              hay bộ ấm chén mang đậm dấu ấn văn hóa Việt không chỉ là vật dụng
              mà còn là tác phẩm nghệ thuật, kể câu chuyện về lịch sử, tín
              ngưỡng, và trí tuệ của người Việt qua nhiều thế hệ.
            </p> */}

            <small>
              Gốm sứ Việt Nam qua các triều đại là một hành trình dài, phản ánh
              sự phát triển của kỹ thuật, mỹ thuật và văn hóa xã hội. Thời Lý
              (1010 – 1225): Đây là giai đoạn gốm Việt bắt đầu khẳng định bản
              sắc riêng. Gốm thời Lý thường được làm bằng đất sét địa phương,
              nung ở nhiệt độ cao, men trắng hoặc men nâu đỏ. Họa tiết phổ biến
              là hoa lá, con vật thần thoại và các họa tiết hình học đơn giản,
              thể hiện vẻ đẹp thanh thoát, tinh tế và gần gũi với thiên nhiên.
              Thời Trần (1225 – 1400): Nghề gốm phát triển mạnh mẽ, đặc biệt là
              gốm men trắng, men nâu và men rạn. Các sản phẩm thời Trần thường
              là vật dụng sinh hoạt nhưng cũng mang tính thẩm mỹ cao. Họa tiết
              rồng, phượng, hoa sen xuất hiện nhiều hơn, phản ánh văn hóa tín
              ngưỡng và phong tục thờ cúng. Thời Lê (1428 – 1789): Đây là thời
              kỳ gốm sứ đạt đến độ tinh xảo cao, đặc biệt là gốm Chu Đậu, nổi
              bật với men trắng mịn, họa tiết lam vẽ bằng tay và các hình tượng
              sinh động như rồng, phượng, hoa cúc, hoa sen. Gốm Lê vừa phục vụ
              nhu cầu trong nước, vừa được xuất khẩu ra nhiều nước châu Á và
              châu Âu, góp phần đưa văn hóa Việt ra thế giới. Thời Nguyễn (1802
              – 1945): Gốm sứ thời Nguyễn mang dấu ấn cung đình. Các sản phẩm
              được chế tác công phu, dùng trong cung điện, lễ nghi, đền chùa.
              Men lam, men xanh ngọc, men rạn và men trắng là phổ biến. Họa tiết
              rồng chầu, hoa sen, chim phượng được trang trí tinh xảo, mang tính
              tượng trưng cao. Đây cũng là thời kỳ gốm sứ Việt tiếp nhận ảnh
              hưởng từ Trung Quốc và Nhật Bản nhưng vẫn giữ được bản sắc văn hóa
              dân tộc. Văn hóa gốm sứ Việt Nam không chỉ thể hiện ở kỹ thuật hay
              hình dáng mà còn ở cách sử dụng trong đời sống. Người Việt dùng
              gốm trong sinh hoạt hằng ngày, trong nghi lễ tôn giáo, trong phong
              thủy và cả trong nghệ thuật trang trí. Một chiếc bình hoa hay bộ
              ấm chén không đơn thuần là vật dụng, mà còn là biểu tượng của sự
              tinh tế, lòng hiếu khách, niềm tin vào may mắn và sự thịnh vượng.
              Ngày nay, gốm sứ Việt Nam vẫn phát triển mạnh mẽ, kết hợp truyền
              thống và sáng tạo hiện đại. Nhiều nghệ nhân trẻ thử nghiệm men
              mới, hình dáng mới, kết hợp với các kỹ thuật trang trí hiện đại
              như khắc laser hay in men màu, tạo ra những sản phẩm vừa giữ được
              giá trị truyền thống, vừa phù hợp với thẩm mỹ đương đại. Gốm sứ
              Việt Nam không chỉ là di sản văn hóa vật thể, mà còn là di sản
              tinh thần, minh chứng cho trí tuệ, sự khéo léo, kiên nhẫn và sáng
              tạo của người Việt qua hàng nghìn năm. Từ các làng nghề truyền
              thống đến các phòng triển lãm quốc tế, gốm sứ Việt vẫn luôn là
              biểu tượng sống động của văn hóa dân tộc, kết nối quá khứ, hiện
              tại và tương lai.
            </small>
          </div>
          <div className="images">
            <img src={ceramic3} alt="Gốm sứ cổ" />
            <img src={ceramic2} alt="Nghệ nhân làm gốm" />
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="fun-facts">
        <h2>Những sự thật thú vị về Gốm Sứ</h2>
        <ul>
          <li>
            Mỗi lò gốm truyền thống phải nung ít nhất 3 ngày để đạt nhiệt độ
            chuẩn.
          </li>
          <li>
            Người xưa dùng bùn sét trộn với tro cây để tạo độ dẻo và bền cho
            gốm.
          </li>
          <li>Họa tiết rồng trên gốm tượng trưng cho quyền lực và may mắn.</li>
          <li>
            Một chiếc bình gốm cổ có thể được truyền qua 5 – 6 thế hệ mà vẫn
            nguyên vẹn.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CeramicLanding;
