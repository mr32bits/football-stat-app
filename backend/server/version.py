class Version(object):

    def __init__(self, version:str):
        self.version = version.strip().split('.')

    def __eq__(self, other):
        return self.version == other.version
    
    def __ne__(self, other):
        return not self.__eq__(other)
    
    def __lt__ (self, other):
        for version1, version2 in zip(self.version, other.version):
            if float(version1) < float(version2):
                return True
            elif float(version1) > float(version2):
                return False
        return False

    def __gt__ (self, other):
        return other.__lt__(self)
    
    def __ge__(self, other):
        return self.__gt__(other) or self.__eq__(other)
    
    def __le__(self, other):
        return self.__lt__(other) or self.__eq__(other)
    
    def __str__(self):
        s = '.'.join(self.version)
        return s
    
if __name__ == '__main__':
    print(Version('1.1.3') == Version('1.2.3'))
    print(Version('1.1.3') != Version('1.2.3'))
    print(Version('2.1.3') > Version('1.2.3'))
    print(Version('2.1.3') < Version('1.2.3'))
    print(Version('1.2.3') >= Version('1.2.3'))
    print(Version('1.2.3') <= Version('1.2.3'))