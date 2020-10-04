# EC2 생성 및 DB 설치



## 서버 생성 및 설정

1. **Ncloud 서버 생성하고 ACG 추가**

![image-20201005011105014](https://user-images.githubusercontent.com/7006837/95023120-2afd7400-06b6-11eb-9d5d-36e65b53f732.png)

2. **Public IP 생성**

3. **접속**

   ```
   ssh root@공인IP
   ```

   

4. **유저 생성**

   ```
   adduser wonseok
   ```

5. **권한 부여**

   - root 계정으로 접속
   - ``sudo vi /etc/sudoers`` 

   - ```
     # User privilege specification
     root    ALL=(ALL:ALL) ALL
     wonseok ALL=(ALL) NOPASSWD:ALL <- 추가
     ```



## DB 설치

### 최초 접속 후 우분투 패키지 업그레이드 및 한글 설정

```bash
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install language-pack-ko
$ sudo locale-gen ko_KR.UTF-8
```

### 이어서 한글 로케일 설정

```bash
$ locale
$ sudo -i
$ cat << 'EOF' > /etc/default/locale
LANG="ko_KR.UTF-8"
LANGUAGE="ko_KR:ko:en_US:en"
EOF
```

- bash 재시작 (혹은 ubuntu 재부팅) 후 확인

```bash
locale
```

### mysql 설치

- 중간에 root password를 꼭 넣어주어야 합니다.
- 패스워드 분실시 새로 설치가 빠름 (클라우드라서)
- OS 버전과 MySQL 버전에 따라 설치방법이 달라질 수 있으므로 검색을 활용한다.

### 버전별 참고 링크

- https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04
- https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04

### 설치 스크립트

```bash
$ sudo apt install mysql-server
$ sudo systemctl start mysql
$ sudo mysql_secure_installation
```

### 18.04 root 접속

18.04 기준으로 auth socket을 이용해서 root 접속을 하게 되었다.
`mysql -u root -p` 접속이 되지 않는 경우에는 그냥 포기하자.

```bash
# root 접속
$ sudo mysql
mysql> quit
```

### utf-8 설정

- 리눅스의 경우 초기 설정은 latin1으로 되어 있는 경우가 많다.
- 한글 처리를 위해 utf8로 설정을 바꾸는 편이 좋다.

```sql
mysql> status

$ sudo -i #root
$ cat /etc/mysql/my.cnf
$ cat << 'EOF' > /etc/mysql/mysql.conf.d/utf8.cnf
# for utf8 characterset
[client]
default-character-set = utf8

[mysqld]
init_connect = SET collation_connection = utf8_general_ci
init_connect = SET NAMES utf8
character-set-server = utf8
collation-server = utf8_general_ci

[mysqldump]
default-character-set = utf8

[mysql]
default-character-set = utf8
EOF

$ cat /etc/mysql/mysql.conf.d/utf8.cnf
# ctrl + d 로 root 로그아웃, 일반 사용자로 돌아옴
$ sudo systemctl restart mysql
$ sudo mysql
mysql> status
```

### 일반사용자 외부 접속 허용

```bash
$ sudo -i
$ cd /etc/mysql
$ grep -r 'bind'
# bind-adress=127.0.0.1 내용 주석처리 (앞에 #을 붙임)
$ cd /etc/mysql/mysql.conf.d
$ sed -i 's/bind/# bind/' mysqld.cnf
$ cat mysqld.cnf | grep bind
$ sudo systemctl restart mysql
$ exit
```

- 주의: root 사용자의 외부 접속은 허용하면 안 됩니다.

### 재부팅시 mysqld 자동 실행

```bash
$ sudo reboot
$ mysql -u root -p
$ sudo update-rc.d mysql defaults
# 자동 실행 취소 명령 (참고용, 타이핑하지 마세요)
# sudo update-rc.d mysql remove
$ sudo reboot
$ mysql -u root -p
```

### 데이터베이스 및 일반 사용자 생성

```sql
CREATE DATABASE mydb;
 아이디 및 패스워드 설정
CREATE USER 'myuserid'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL ON mydb.* TO 'myuserid'@'%';
FLUSH PRIVILEGES;
```

`mydb`: 데이터베이스 이름

`myuserid`: 사용자 id

`mypassword`: 사용자 패스워드

### 사용자 패스워드가 생각나지 않을 때

루트 사용자로 로그인 후 일반 사용자 패스워드는 쉽게 변경 가능

```sql
SET PASSWORD FOR 'honux'@'%'='new_password';
FLUSH PRIVILEGES;
```
