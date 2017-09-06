---
layout: post
title: Java 锦囊
permalink: /troubleshoots/java

date: 2017-07-09

---

* content
{:toc}

---

## Java8 LocalDateTime/LocalDate to Date

##### 更新时间：2017-08-19

```java
@Test
@DisplayName("Format date to sting with style 2017-08-08 08:08:08")
void formatDate() {
        LocalDateTime localDate = LocalDateTime.parse("2017-08-08 08:08:08",
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Date date = Date.from(localDate.atZone(ZoneId.systemDefault()).toInstant());

        assertThat(DateUtils.formatDateToString(date), is("2017-08-08 08:08:08")); 
}

public static String formatDateToString(Date date) {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
}

private Date currentDate() {
    	LocalDate localDate = Instant.now().atZone(ZoneOffset.UTC).toLocalDate();
        return Date.from(localDate.atStartOfDay(ZoneOffset.systemDefault()).toInstant());
}

```

---

## Java MD5 加密

##### 更新时间：2017-07-09

```java
import java.security.MessageDigest;

public final class MD5Utils {

    private static final String METHOD_MD5 = "MD5";

    private MD5Utils() {
        throw new IllegalStateException();
    }

    public static String encryptByMD5(String param) {
        return encrypt(param, METHOD_MD5);
    }

    private static String encrypt(String param, String algorithm) {
        try {
            MessageDigest md5 = MessageDigest.getInstance(algorithm);
            byte[] byteArray = param.getBytes("ISO-8859-1");
            byte[] md5Bytes = md5.digest(byteArray);
            StringBuilder hexValue = new StringBuilder();
            for (int i = 0; i < md5Bytes.length; i++) {
                int val = ((int) md5Bytes[i]) & 0xff;
                if (val < 16) {
                    hexValue.append(0);
                }
                hexValue.append(Integer.toHexString(val));
            }
            return hexValue.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

